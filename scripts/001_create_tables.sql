-- Create users (extends auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  role text default 'user', -- 'admin', 'user'
  created_at timestamp with time zone default now()
);

-- Create meetings
create table if not exists public.meetings (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone,
  max_participants int default 4,
  status text default 'pending', -- 'pending', 'active', 'completed'
  recording_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create meeting participants
create table if not exists public.meeting_participants (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.meetings(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text default 'participant', -- 'host', 'co-host', 'participant'
  joined_at timestamp with time zone default now(),
  left_at timestamp with time zone,
  unique(meeting_id, user_id)
);

-- Create co-host bookings
create table if not exists public.co_host_bookings (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.meetings(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  status text default 'pending', -- 'pending', 'approved', 'rejected'
  requested_at timestamp with time zone default now(),
  approved_at timestamp with time zone,
  approved_by uuid references public.users(id),
  unique(meeting_id, user_id)
);

-- Create chat messages
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.meetings(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.users enable row level security;
alter table public.meetings enable row level security;
alter table public.meeting_participants enable row level security;
alter table public.co_host_bookings enable row level security;
alter table public.chat_messages enable row level security;

-- Users policies
create policy "users_select_own" on public.users for select using (auth.uid() = id);
create policy "users_insert_own" on public.users for insert with check (auth.uid() = id);
create policy "users_update_own" on public.users for update using (auth.uid() = id);

-- Meetings policies
create policy "meetings_select_own_or_participant" on public.meetings for select
  using (auth.uid() = host_id or id in (select meeting_id from public.meeting_participants where user_id = auth.uid()));
create policy "meetings_insert_own" on public.meetings for insert with check (auth.uid() = host_id);
create policy "meetings_update_own" on public.meetings for update using (auth.uid() = host_id);

-- Meeting participants policies
create policy "participants_select" on public.meeting_participants for select
  using (auth.uid() in (select host_id from public.meetings where id = meeting_id) or auth.uid() = user_id);
create policy "participants_insert" on public.meeting_participants for insert with check (true);

-- Co-host bookings policies
create policy "bookings_select" on public.co_host_bookings for select
  using (auth.uid() = user_id or auth.uid() in (select host_id from public.meetings where id = meeting_id));
create policy "bookings_insert" on public.co_host_bookings for insert with check (auth.uid() = user_id);
create policy "bookings_update_admin" on public.co_host_bookings for update
  using (auth.uid() in (select host_id from public.meetings where id = meeting_id));

-- Chat messages policies
create policy "messages_select" on public.chat_messages for select
  using (auth.uid() in (select user_id from public.meeting_participants where meeting_id = meeting_id));
create policy "messages_insert" on public.chat_messages for insert with check (auth.uid() = user_id);

-- Create trigger for auto-creating user profile
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
