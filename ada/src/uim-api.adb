with UIM.Translate;
with UIM.Format;
with UIM.Places;

package body UIM.API is

   In_Buffer  : String (1 .. Max_Text);
   Out_Buffer : String (1 .. 2 * Max_Text);

   function In_Address return System.Address is (In_Buffer'Address);
   function Out_Address return System.Address is (Out_Buffer'Address);

   --  Unknown numbers fall back to English.
   function Lang_Of (N : Integer) return Language is
     (if N in 0 .. 3 then Language'Val (N) else EN);

   function Clip (N : Integer) return Natural is
     (if N < 0 then 0 elsif N > Max_Text then Max_Text else N);

   function Translate (Lang : Integer; Length : Integer) return Integer is
      Last : Natural;
   begin
      UIM.Translate (Lang_Of (Lang), In_Buffer (1 .. Clip (Length)), Out_Buffer, Last);
      return Last;
   end Translate;

   function Number (Lang : Integer; Length : Integer) return Integer is
      Last : Natural := 0;
   begin
      UIM.Format.Number (Lang_Of (Lang), In_Buffer (1 .. Clip (Length)), Out_Buffer, Last);
      return Last;
   end Number;

   function Quantity (Lang : Integer; Length : Integer; Unit : Integer)
     return Integer
   is
      Last : Natural := 0;
      U : constant UIM.Format.Unit :=
        (if Unit in 0 .. 4 then UIM.Format.Unit'Val (Unit) else UIM.Format.Acres);
   begin
      UIM.Format.Quantity (Lang_Of (Lang), In_Buffer (1 .. Clip (Length)), U,
                           Out_Buffer, Last);
      return Last;
   end Quantity;

   function Place (Lang : Integer) return Integer is
      Last : Natural;
   begin
      UIM.Places.To_JSON (Lang_Of (Lang), Out_Buffer, Last);
      return Last;
   end Place;

   function Version return Integer is
   begin
      Out_Buffer (1 .. UIM.Version'Length) := UIM.Version;
      return UIM.Version'Length;
   end Version;

end UIM.API;
