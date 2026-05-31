create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  customer_name text not null,
  contact_name text not null,
  email text,
  phone text,
  service text not null,
  quote_amount_cents integer not null check (quote_amount_cents >= 0),
  quote_sent_on date not null,
  status text not null default 'open' check (status in ('open', 'won', 'lost', 'snoozed')),
  last_touch_at timestamptz,
  notes text,
  next_follow_up_at timestamptz,
  follow_up_stage integer,
  last_follow_up_channel text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Idempotent column additions for quotes
alter table public.quotes add column if not exists next_follow_up_at timestamptz;
alter table public.quotes add column if not exists follow_up_stage integer;
alter table public.quotes add column if not exists last_follow_up_channel text;

create table if not exists public.quote_follow_ups (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  channel text,
  message text,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.app_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  event_name text not null,
  properties jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.quotes enable row level security;
alter table public.app_events enable row level security;

create index if not exists quotes_user_id_idx on public.quotes (user_id);
create index if not exists quotes_user_status_idx on public.quotes (user_id, status);
create index if not exists quotes_user_sent_on_idx on public.quotes (user_id, quote_sent_on);
create index if not exists app_events_user_id_idx on public.app_events (user_id);
create index if not exists app_events_user_event_idx on public.app_events (user_id, event_name);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists quotes_set_updated_at on public.quotes;
create trigger quotes_set_updated_at
before update on public.quotes
for each row execute function public.set_updated_at();

drop policy if exists "Users can read own quotes" on public.quotes;
create policy "Users can read own quotes"
on public.quotes for select
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own quotes" on public.quotes;
create policy "Users can insert own quotes"
on public.quotes for insert
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own quotes" on public.quotes;
create policy "Users can update own quotes"
on public.quotes for update
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own quotes" on public.quotes;
create policy "Users can delete own quotes"
on public.quotes for delete
using ((select auth.uid()) = user_id);

alter table public.quote_follow_ups enable row level security;

drop policy if exists "Users can read own follow ups" on public.quote_follow_ups;
create policy "Users can read own follow ups"
on public.quote_follow_ups for select
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own follow ups" on public.quote_follow_ups;
create policy "Users can insert own follow ups"
on public.quote_follow_ups for insert
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can read own events" on public.app_events;
create policy "Users can read own events"
on public.app_events for select
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own events" on public.app_events;
create policy "Users can insert own events"
on public.app_events for insert
with check ((select auth.uid()) = user_id);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  sender_name text,
  business_name text,
  phone text,
  signature text,
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,
  stripe_current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Idempotent column addition for existing databases
alter table public.profiles add column if not exists stripe_current_period_end timestamptz;

create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  timing_label text not null,
  body text not null,
  stage_day integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.templates enable row level security;

create index if not exists templates_user_id_idx on public.templates (user_id);
create index if not exists templates_user_stage_idx on public.templates (user_id, stage_day);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists templates_set_updated_at on public.templates;
create trigger templates_set_updated_at
before update on public.templates
for each row execute function public.set_updated_at();

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles for select
using ((select auth.uid()) = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles for insert
with check ((select auth.uid()) = id);

drop policy if exists "Users can read own templates" on public.templates;
create policy "Users can read own templates"
on public.templates for select
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own templates" on public.templates;
create policy "Users can insert own templates"
on public.templates for insert
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own templates" on public.templates;
create policy "Users can update own templates"
on public.templates for update
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own templates" on public.templates;
create policy "Users can delete own templates"
on public.templates for delete
using ((select auth.uid()) = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);

  insert into public.templates (user_id, name, timing_label, body, stage_day)
  values
    (new.id, 'Day 2 — The Bump', 'Send 2 days after quoting', 'Hi {{customer_name}},

Just floating this to the top of your inbox. Did you have any questions about the quote for {{service}}?

Thanks,
{{sender_name}}
{{business_name}}', 2),
    (new.id, 'Day 7 — The Check-in', 'Send 1 week after quoting', 'Hi {{customer_name}},

Checking in on the quote from last week for {{service}}. Let me know if you need me to adjust anything to make this work for your budget.

Best,
{{sender_name}}
{{business_name}}', 7),
    (new.id, 'Day 14 — The Resource', 'Send 2 weeks after quoting', 'Hi {{customer_name}},

I know things get busy. While you''re reviewing the quote for {{service}}, here is a quick overview of our process and what you can expect when we start.

Talk soon,
{{sender_name}}
{{business_name}}', 14),
    (new.id, 'Day 30 — The Breakup', 'Send 1 month after quoting', 'Hi {{customer_name}},

I haven''t heard back regarding the {{service}} quote, so I''m assuming this isn''t a priority right now. I''ll close this out on my end. Feel free to reach out if things change!

Cheers,
{{sender_name}}
{{business_name}}', 30);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create table if not exists public.feedbacks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  message text not null,
  sentiment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.feedbacks enable row level security;

create index if not exists feedbacks_user_id_idx on public.feedbacks (user_id);

drop trigger if exists feedbacks_set_updated_at on public.feedbacks;
create trigger feedbacks_set_updated_at
before update on public.feedbacks
for each row execute function public.set_updated_at();

drop policy if exists "Users can insert own feedback" on public.feedbacks;
create policy "Users can insert own feedback"
on public.feedbacks for insert
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can read own feedback" on public.feedbacks;
create policy "Users can read own feedback"
on public.feedbacks for select
using ((select auth.uid()) = user_id);

