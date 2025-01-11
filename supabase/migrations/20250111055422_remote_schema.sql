create table "public"."favoriteGroups" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null default '無題'::text,
    "articles" jsonb not null,
    "userName" text not null default '非公開'::text,
    "isPublished" boolean not null default false,
    "userId" uuid not null default gen_random_uuid(),
    "createdAt" timestamp with time zone not null default now(),
    "updatedAt" timestamp with time zone not null default now()
);


alter table "public"."favoriteGroups" enable row level security;

CREATE UNIQUE INDEX "favoriteGroups_pkey" ON public."favoriteGroups" USING btree (id);

alter table "public"."favoriteGroups" add constraint "favoriteGroups_pkey" PRIMARY KEY using index "favoriteGroups_pkey";

alter table "public"."favoriteGroups" add constraint "favoriteGroups_userId_fkey" FOREIGN KEY ("userId") REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."favoriteGroups" validate constraint "favoriteGroups_userId_fkey";

grant delete on table "public"."favoriteGroups" to "anon";

grant insert on table "public"."favoriteGroups" to "anon";

grant references on table "public"."favoriteGroups" to "anon";

grant select on table "public"."favoriteGroups" to "anon";

grant trigger on table "public"."favoriteGroups" to "anon";

grant truncate on table "public"."favoriteGroups" to "anon";

grant update on table "public"."favoriteGroups" to "anon";

grant delete on table "public"."favoriteGroups" to "authenticated";

grant insert on table "public"."favoriteGroups" to "authenticated";

grant references on table "public"."favoriteGroups" to "authenticated";

grant select on table "public"."favoriteGroups" to "authenticated";

grant trigger on table "public"."favoriteGroups" to "authenticated";

grant truncate on table "public"."favoriteGroups" to "authenticated";

grant update on table "public"."favoriteGroups" to "authenticated";

grant delete on table "public"."favoriteGroups" to "service_role";

grant insert on table "public"."favoriteGroups" to "service_role";

grant references on table "public"."favoriteGroups" to "service_role";

grant select on table "public"."favoriteGroups" to "service_role";

grant trigger on table "public"."favoriteGroups" to "service_role";

grant truncate on table "public"."favoriteGroups" to "service_role";

grant update on table "public"."favoriteGroups" to "service_role";


