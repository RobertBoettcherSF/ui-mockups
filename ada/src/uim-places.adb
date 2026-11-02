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
      Put ("""");
      --  Local details: locale, time zone labels (standard, summer, offset
      --  in minutes), coast scenery, seas, coast cameras, sea temperature
      --  and crops. Pages draw and label from these; texts.tsv translates.
      case L is
         when EN =>
            Put (",""locale"":""en-GB"",""zone"":[""GMT"",""BST"",0],""coast"":""cliffs"",""seas"":[""North Sea"",""Atlantic"",""English Channel""],""cams"":[""NORTH SEA COASTAL WEBCAM"",""ATLANTIC CLIFF CAM""],""water"":11.2,""phone"":""+44 20 7946 0100"",""crops"":[""Wheat"",""Barley"",""Oilseed rape"",""Potatoes"",""Grass ley""]");
            Put (",""gov"":[51.4995,-0.1248],""district"":""GOVERNMENT DISTRICT LONDON"",""img"":[[51.48138,-0.15381],[51.52242,-0.08789]],""flag"":[""#012169"",""#ffffff"",""#c8102e""],""flagdir"":""uk"",""nodes"":[[53.48,-2.24],[52.49,-1.89],[55.95,-3.19],[51.48,-3.18],[54.60,-5.93],[51.45,-2.59],[53.80,-1.55],[55.86,-4.25]]");
         when DE =>
            Put (",""locale"":""de-DE"",""zone"":[""CET"",""CEST"",60],""coast"":""dunes"",""seas"":[""Baltic"",""North Sea"",""Wadden Sea""],""cams"":[""BALTIC COASTAL WEBCAM"",""NORTH SEA DUNE CAM""],""water"":9.6,""phone"":""+49 30 23125 100"",""crops"":[""Wheat"",""Barley"",""Oilseed rape"",""Maize"",""Sugar beet""]");
            Put (",""gov"":[52.5186,13.3762],""district"":""BUNDESTAG"",""img"":[[52.49616,13.3374],[52.53627,13.40332]],""flag"":[""#000000"",""#dd0000"",""#ffce00""],""flagdir"":""h"",""nodes"":[[53.55,9.99],[48.14,11.58],[50.94,6.96],[50.11,8.68],[48.78,9.18],[51.34,12.37],[52.37,9.73],[51.05,13.74]]");
         when ES =>
            Put (",""locale"":""es-ES"",""zone"":[""CET"",""CEST"",60],""coast"":""palms"",""seas"":[""Mediterranean"",""Balearic Sea"",""Alboran Sea""],""cams"":[""MEDITERRANEAN COASTAL WEBCAM"",""BALEARIC PALM BEACH CAM""],""water"":17.8,""phone"":""+34 910 000 100"",""crops"":[""Wheat"",""Barley"",""Olives"",""Sunflower"",""Vines""]");
            Put (",""gov"":[40.4163,-3.6966],""district"":""GOVERNMENT DISTRICT MADRID"",""img"":[[40.39676,-3.73535],[40.44695,-3.66943]],""flag"":[""#aa151b"",""#f1bf00"",""#aa151b""],""flagdir"":""h"",""nodes"":[[41.39,2.17],[39.47,-0.38],[37.39,-5.98],[43.26,-2.93],[41.65,-0.89],[36.72,-4.42],[41.65,-4.72],[43.36,-8.41]]");
         when FR =>
            Put (",""locale"":""fr-FR"",""zone"":[""CET"",""CEST"",60],""coast"":""pines"",""seas"":[""Atlantic"",""Bay of Biscay"",""Mediterranean""],""cams"":[""ATLANTIC COASTAL WEBCAM"",""MEDITERRANEAN PINE COAST CAM""],""water"":14.1,""phone"":""+33 1 99 00 01 00"",""crops"":[""Wheat"",""Maize"",""Oilseed rape"",""Sugar beet"",""Vines""]");
            Put (",""gov"":[48.8619,2.3186],""district"":""GOVERNMENT DISTRICT PARIS"",""img"":[[48.8358,2.28516],[48.87917,2.35107]],""flag"":[""#002395"",""#ffffff"",""#ed2939""],""flagdir"":""v"",""nodes"":[[45.76,4.84],[44.84,-0.58],[43.30,5.37],[50.63,3.06],[47.22,-1.55],[43.60,1.44],[48.57,7.75],[48.11,-1.68]]");
      end case;
      Put ("}");
   end To_JSON;

end UIM.Places;
