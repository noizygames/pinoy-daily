-- Run in Supabase SQL Editor so the anon key can read/write the community pool.

alter table public.community_predictions enable row level security;
alter table public.community_excuses enable row level security;
alter table public.community_superpowers enable row level security;

create policy "community_predictions_select"
  on public.community_predictions for select
  using (true);

create policy "community_predictions_insert"
  on public.community_predictions for insert
  with check (true);

create policy "community_predictions_delete"
  on public.community_predictions for delete
  using (true);

create policy "community_excuses_select"
  on public.community_excuses for select
  using (true);

create policy "community_excuses_insert"
  on public.community_excuses for insert
  with check (true);

create policy "community_excuses_delete"
  on public.community_excuses for delete
  using (true);

create policy "community_superpowers_select"
  on public.community_superpowers for select
  using (true);

create policy "community_superpowers_insert"
  on public.community_superpowers for insert
  with check (true);

create policy "community_superpowers_delete"
  on public.community_superpowers for delete
  using (true);

alter table public.community_pickup_lines enable row level security;
alter table public.daily_ulam enable row level security;

create policy "community_pickup_lines_select"
  on public.community_pickup_lines for select
  using (true);

create policy "community_pickup_lines_insert"
  on public.community_pickup_lines for insert
  with check (true);

create policy "community_pickup_lines_update"
  on public.community_pickup_lines for update
  using (true)
  with check (true);

create policy "community_pickup_lines_delete"
  on public.community_pickup_lines for delete
  using (true);

create policy "daily_ulam_select"
  on public.daily_ulam for select
  using (true);

create policy "daily_ulam_insert"
  on public.daily_ulam for insert
  with check (true);

alter table public.feedback enable row level security;

create policy "feedback_select"
  on public.feedback for select
  using (true);

create policy "feedback_insert"
  on public.feedback for insert
  with check (true);
