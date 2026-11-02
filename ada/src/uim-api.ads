--  The entry points JavaScript calls (vendor/lang.js).
--  JS writes UTF-8 text into In_Buffer, calls a function, then reads
--  Out_Buffer (1 .. result). Languages are numbered 0 EN, 1 DE, 2 ES, 3 FR.
with System;

package UIM.API is

   function In_Address return System.Address
     with Export, Convention => C, External_Name => "uim_in";
   function Out_Address return System.Address
     with Export, Convention => C, External_Name => "uim_out";

   --  Translate In_Buffer (1 .. Length) into language Lang.
   function Translate (Lang : Integer; Length : Integer) return Integer
     with Export, Convention => C, External_Name => "uim_t";

   --  Format the number In_Buffer (1 .. Length): "1,234.5" -> "1.234,5".
   function Number (Lang : Integer; Length : Integer) return Integer
     with Export, Convention => C, External_Name => "uim_num";

   --  Quantity in an English unit (0 acres, 1 °F, 2 mi, 3 mph, 4 ft).
   function Quantity (Lang : Integer; Length : Integer; Unit : Integer)
     return Integer
     with Export, Convention => C, External_Name => "uim_qty";

   --  Place of Lang as JSON.
   function Place (Lang : Integer) return Integer
     with Export, Convention => C, External_Name => "uim_place";

   --  Zone at the UTC instant Y-Mo-D H:00 for Lang: "LABEL|offset_minutes".
   --  EU summer time: last Sunday of March 01:00 UTC to last Sunday of
   --  October 01:00 UTC. Labels: EN GMT/BST, DE MEZ/MESZ, ES CET/CEST, FR HNEC/HAEC.
   function Zone (Lang : Integer; Y, Mo, D, H : Integer) return Integer
     with Export, Convention => C, External_Name => "uim_zone";

   --  Version of this core, e.g. "1.12.0".
   function Version return Integer
     with Export, Convention => C, External_Name => "uim_version";

end UIM.API;
