package body UIM.Places is

   procedure To_JSON (L : Language; Result : in out String; Last : out Natural) is
      P : Place renames Table (L);

      procedure Put (S : String) is
      begin
         for C of S loop
            if Last < Result'Last then
               Last := Last + 1;
               Result (Last) := C;
            end if;
         end loop;
      end Put;

      --  Put S without its padding spaces at the end.
      procedure Put_Trimmed (S : String) is
         E : Natural := S'Last;
      begin
         while E >= S'First and then S (E) = ' ' loop
            E := E - 1;
         end loop;
         Put (S (S'First .. E));
      end Put_Trimmed;

      --  1/100 degree as JSON number: 5252 -> 52.52, -370 -> -3.70
      procedure Put_Degrees (V : Integer) is
         A : constant Natural := abs V;
      begin
         if V < 0 then
            Put ("-");
         end if;
         if A >= 10_000 then
            Put ((1 => Character'Val (48 + A / 10_000)));
         end if;
         if A >= 1_000 then
            Put ((1 => Character'Val (48 + A / 1_000 mod 10)));
         end if;
         Put ((1 => Character'Val (48 + A / 100 mod 10)));
         Put (".");
         Put ((Character'Val (48 + A mod 100 / 10), Character'Val (48 + A mod 10)));
      end Put_Degrees;
   begin
      Last := Result'First - 1;
      Put ("{""code"":""");    Put (P.Code);
      Put (""",""country"":"""); Put_Trimmed (P.Country);
      Put (""",""capital"":"""); Put_Trimmed (P.Capital);
      Put (""",""home"":[");
      Put_Degrees (P.Home_Lat); Put (","); Put_Degrees (P.Home_Lon);
      Put ("],""center"":[");
      Put_Degrees (P.Map_Lat); Put (","); Put_Degrees (P.Map_Lon);
      Put ("],""zoom"":");       Put ((1 => Character'Val (48 + P.Zoom)));
      Put (",""tz"":""");        Put_Trimmed (P.Time_Zone);
      Put ("""}");
   end To_JSON;

end UIM.Places;
