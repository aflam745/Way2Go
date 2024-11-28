create table if not exists itinerary(
  id text primary key,
  data blob not null,
  path text
);
