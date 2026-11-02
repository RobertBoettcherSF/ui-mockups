--  The place behind each flag. Maps centre on it, "home" markers sit on
--  its capital and region outlines come from vendor/data-regions-eu.js.
--  English is the United Kingdom (London) since v1.12.1, by Robert's choice.
package UIM.Places is

   type Place is record
      Code      : String (1 .. 2);   --  html lang and region key: "en", "de" ...
      Country   : String (1 .. 14);  --  padded with spaces
      Capital   : String (1 .. 10);
      Home_Lat, Home_Lon : Integer;  --  capital, in 1/100 degree
      Map_Lat, Map_Lon   : Integer;  --  map centre, in 1/100 degree
      Zoom      : Natural;
      Time_Zone : String (1 .. 15);
   end record;

   Table : constant array (Language) of Place :=
     (EN => ("en", "United Kingdom", "London    ", 5151, -13, 5400, -250, 5,
             "Europe/London  "),
      DE => ("de", "Deutschland   ", "Berlin    ", 5252, 1340, 5120, 1040, 5,
             "Europe/Berlin  "),
      ES => ("es", "Espa" & Character'Val (16#C3#) & Character'Val (16#B1#) & "a       ", "Madrid    ", 4042, -370, 4020, -370, 5,
             "Europe/Madrid  "),
      FR => ("fr", "France        ", "Paris     ", 4886, 235, 4660, 250, 5,
             "Europe/Paris   "));

   --  The place of L as a small JSON object.
   procedure To_JSON (L : Language; Result : in out String; Last : out Natural);

end UIM.Places;
