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
