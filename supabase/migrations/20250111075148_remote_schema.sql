drop policy "Enable users to view their own data only" on "public"."favorites";

create policy "Enable delete for users based on user_id"
on "public"."favoriteGroups"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = "userId"));


create policy "Enable insert for users based on user_id"
on "public"."favoriteGroups"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = "userId"));


create policy "Enable read access for all users"
on "public"."favoriteGroups"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for users based on user_id"
on "public"."favoriteGroups"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = "userId"))
with check ((( SELECT auth.uid() AS uid) = "userId"));


create policy "Enable read access for all users"
on "public"."favorites"
as permissive
for select
to public
using (true);



