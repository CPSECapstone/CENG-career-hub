-- initial database setup for the Career Hub project
-- this only makes the empty tables for now since we haven't decided on authentication yet

create extension if not exists pgcrypto;

-- we're not using authentication yet, so this just stores the basic info for each user
create table public.users (
  id uuid primary key default gen_random_uuid(),
  name text,
  username text unique,
  email text unique,
  profile_picture text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.departments (
  id bigint generated always as identity primary key,
  name text not null,
  email_address text not null unique
);

create table public.newsletters (
  id bigint generated always as identity primary key,
  department_id bigint not null references public.departments(id) on delete restrict,
  gmail_message_id text unique,
  subject text not null,
  sender_email text not null,
  sent_at timestamptz,
  scraped_at timestamptz not null default now(),
  email_body text
);

create table public.opportunities (
  id bigint generated always as identity primary key,
  newsletter_id bigint not null references public.newsletters(id) on delete cascade,
  title text not null,
  description text,
  category text not null check (category in (
    'job',
    'internship',
    'scholarship',
    'research',
    'competition',
    'recruiting_event',
    'club_event',
    'other'
  )),
  organization text,
  deadline timestamptz,
  location text,
  application_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- users can prefer more than one type of opportunity, so the categories are stored in an array
create table public.user_preferences (
  user_id uuid primary key references public.users(id) on delete cascade,
  preferred_categories text[] not null default '{}',
  new_opportunities_enabled boolean not null default true,
  email_notifications_enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

-- this connects users to the opportunities they've saved
create table public.saved_opportunities (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  opportunity_id bigint not null references public.opportunities(id) on delete cascade,
  saved_at timestamptz not null default now(),
  constraint saved_opportunities_user_opportunity_key unique (user_id, opportunity_id)
);

create table public.notifications (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  opportunity_id bigint references public.opportunities(id) on delete cascade,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- these indexes should make it faster to filter and find opportunities
create index newsletters_department_id_idx on public.newsletters(department_id);
create index opportunities_newsletter_id_idx on public.opportunities(newsletter_id);
create index opportunities_category_idx on public.opportunities(category);
create index opportunities_deadline_idx on public.opportunities(deadline);
create index opportunities_created_at_idx on public.opportunities(created_at desc);
create index saved_opportunities_opportunity_id_idx on public.saved_opportunities(opportunity_id);
create index notifications_user_read_created_idx
  on public.notifications(user_id, is_read, created_at desc);
create index notifications_opportunity_id_idx on public.notifications(opportunity_id);

-- this automatically updates updated_at whenever a row gets changed
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_set_updated_at
before update on public.users
for each row execute function public.set_updated_at();

create trigger user_preferences_set_updated_at
before update on public.user_preferences
for each row execute function public.set_updated_at();

-- we'll add authentication and row level security later once we decide how different users should log in
-- (we'll start with students first)
