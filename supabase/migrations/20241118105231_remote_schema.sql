set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.limit_histories_per_user()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  DELETE FROM histories
  WHERE id IN (
    SELECT id FROM histories
    WHERE "userId" = NEW."userId"
    ORDER BY "updatedAt" DESC
    OFFSET 20
  );
  RETURN NEW;
END;$function$
;

CREATE TRIGGER limit_histories_trigger AFTER INSERT ON public.histories FOR EACH ROW EXECUTE FUNCTION limit_histories_per_user();


