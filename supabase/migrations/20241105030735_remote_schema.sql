create table "public"."users" (
    "id" uuid not null default auth.uid(),
    "createdAt" timestamp with time zone not null default now(),
    "name" text not null,
    "avatarUrl" text not null
);


alter table "public"."users" enable row level security;

CREATE UNIQUE INDEX "User_id_key" ON public.users USING btree (id);

CREATE UNIQUE INDEX "User_pkey" ON public.users USING btree (id);

alter table "public"."users" add constraint "User_pkey" PRIMARY KEY using index "User_pkey";

alter table "public"."users" add constraint "User_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "User_id_fkey";

alter table "public"."users" add constraint "User_id_key" UNIQUE using index "User_id_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$declare
  user_name text;
begin
  if new.raw_user_meta_data::json->>'name' is not null then
    user_name := new.raw_user_meta_data::json->>'name';
  else
    user_name := new.raw_user_meta_data::json->>'user_name';
  end if;

  insert into public.users(id, name, "avatarUrl")
  values(
    new.id,
    user_name,
    new.raw_user_meta_data::json->>'avatar_url'
  );

  return new;
end;$function$
;

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

create policy "Enable insert for authenticated users only"
on "public"."users"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."users"
as permissive
for select
to public
using (true);


create policy "User update policy"
on "public"."users"
as permissive
for update
to authenticated
using ((auth.uid() = id))
with check ((auth.uid() = id));



