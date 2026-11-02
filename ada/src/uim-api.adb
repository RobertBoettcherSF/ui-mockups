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

   --  Day of week, 0 = Sunday (Sakamoto).
   function Weekday (Y0, M, D : Integer) return Integer is
      T : constant array (1 .. 12) of Integer := (0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4);
      Y : constant Integer := (if M < 3 then Y0 - 1 else Y0);
   begin
      return (Y + Y / 4 - Y / 100 + Y / 400 + T (M) + D) mod 7;
   end Weekday;

   function Last_Sunday (Y, M : Integer) return Integer is
     (31 - Weekday (Y, M, 31));

   function Zone (Lang : Integer; Y, Mo, D, H : Integer) return Integer is
      L : constant Language := Lang_Of (Lang);
      M : constant Integer := (if Mo in 1 .. 12 then Mo else 1);
      Key : constant Integer := M * 10_000 + D * 100 + H;
      Summer : constant Boolean :=
        Key >= 3 * 10_000 + Last_Sunday (Y, 3) * 100 + 1
        and then Key < 10 * 10_000 + Last_Sunday (Y, 10) * 100 + 1;
      Base : constant Integer := (if L = EN then 0 else 60);
      Off : constant Integer := Base + (if Summer then 60 else 0);
      N : Natural := 0;
      procedure Add (S : String) is
      begin
         Out_Buffer (N + 1 .. N + S'Length) := S;
         N := N + S'Length;
      end Add;
   begin
      case L is
         when EN => Add (if Summer then "BST" else "GMT");
         when DE => Add (if Summer then "MESZ" else "MEZ");
         when ES => Add (if Summer then "CEST" else "CET");
         when FR => Add (if Summer then "HAEC" else "HNEC");
      end case;
      Add ("|");
      if Off >= 100 then
         Add ((1 => Character'Val (48 + Off / 100)));
      end if;
      if Off >= 10 then
         Add ((1 => Character'Val (48 + (Off / 10) mod 10)));
      end if;
      Add ((1 => Character'Val (48 + Off mod 10)));
      return N;
   end Zone;

   function Version return Integer is
   begin
      Out_Buffer (1 .. UIM.Version'Length) := UIM.Version;
      return UIM.Version'Length;
   end Version;

end UIM.API;
