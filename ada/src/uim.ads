--  UI Mockups language core.
--  Everything that depends on the chosen language lives below this package:
--  the texts (UIM.Texts), number, time and unit formatting (UIM.Format),
--  the country behind each flag (UIM.Places) and the C/WASM entry points
--  (UIM.API). The JavaScript side only moves bytes in and out.
package UIM is
   pragma Pure;

   Version : constant String := "1.13.1";

   --  The four flags. English is first and is the fallback.
   type Language is (EN, DE, ES, FR);

   --  Room for one text going in and one coming out.
   Max_Text : constant := 65_536;
   subtype Text_Index is Natural range 0 .. Max_Text;
end UIM;
