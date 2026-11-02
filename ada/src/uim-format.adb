package body UIM.Format is

   procedure Put (S : String; Result : in out String; Last : in out Natural) is
   begin
      for C of S loop
         if Last < Result'Last then
            Last := Last + 1;
            Result (Last) := C;
         end if;
      end loop;
   end Put;

   function Number_Length (Item : String; From : Positive) return Natural is
      I : Natural := From;
   begin
      if From > Item'Last or else not Is_Digit (Item (From)) then
         return 0;
      end if;
      while I <= Item'Last loop
         if Is_Digit (Item (I)) then
            I := I + 1;
         elsif Item (I) in ',' | '.' and then I < Item'Last
           and then Is_Digit (Item (I + 1))
         then
            I := I + 1;
         else
            exit;
         end if;
      end loop;
      return I - From;
   end Number_Length;

   --  Write the digits Int with the group mark of L, then the decimals.
   --  Group marks only when the English text had them ("12,345" yes,
   --  buoy number "47205" no).
   procedure Put_Number (L : Language; Int, Frac : String; Group : Boolean;
                         Result : in out String; Last : in out Natural) is
   begin
      for I in Int'Range loop
         Put ((1 => Int (I)), Result, Last);
         if Group and then I < Int'Last and then (Int'Last - I) mod 3 = 0 then
            case L is
               when EN => Put (",", Result, Last);
               when DE | ES => Put (".", Result, Last);
               when FR =>   --  narrow no-break space U+202F
                  Put (Character'Val (16#E2#) & Character'Val (16#80#)
                       & Character'Val (16#AF#), Result, Last);
            end case;
         end if;
      end loop;
      if Frac'Length > 0 then
         Put ((if L = EN then "." else ","), Result, Last);
         Put (Frac, Result, Last);
      end if;
   end Put_Number;

   procedure Number (L : Language; Item : String;
                     Result : in out String; Last : in out Natural) is
      Dots  : Natural := 0;
      Dot   : Natural := 0;
      Int   : String (1 .. Item'Length);
      N     : Natural := 0;
   begin
      for I in Item'Range loop
         if Item (I) = '.' then
            Dots := Dots + 1;
            Dot := I;
         end if;
      end loop;
      if L = EN or else Dots > 1 then
         Put (Item, Result, Last);
         return;
      end if;
      for I in Item'First .. (if Dot = 0 then Item'Last else Dot - 1) loop
         if Item (I) /= ',' then
            N := N + 1;
            Int (N) := Item (I);
         end if;
      end loop;
      if Dot = 0 then
         Put_Number (L, Int (1 .. N), "", N < Item'Length, Result, Last);
      else
         Put_Number (L, Int (1 .. N), Item (Dot + 1 .. Item'Last),
                     N < Dot - Item'First, Result, Last);
      end if;
   end Number;

   procedure Clock_24 (Item : String;
                       Result : in out String; Last : out Natural) is
      I : Natural := Item'First;

      --  Is there "H:MM AM" or "HH:MM PM" at I? Then H is its hour digits.
      function Is_Clock (H : Natural) return Boolean is
         C : constant Natural := I + H;           --  the colon
      begin
         return C + 5 <= Item'Last
           and then (I = Item'First or else not Is_Alnum (Item (I - 1)))
           and then (for all K in I .. C - 1 => Is_Digit (Item (K)))
           and then Item (C) = ':'
           and then Is_Digit (Item (C + 1)) and then Is_Digit (Item (C + 2))
           and then Item (C + 3) = ' '
           and then Item (C + 4) in 'A' | 'P' and then Item (C + 5) = 'M'
           and then (C + 6 > Item'Last or else not Is_Alnum (Item (C + 6)));
      end Is_Clock;
   begin
      Last := Result'First - 1;
      while I <= Item'Last loop
         declare
            H : constant Natural :=
              (if Is_Clock (2) then 2 elsif Is_Clock (1) then 1 else 0);
         begin
            if H = 0 then
               Put ((1 => Item (I)), Result, Last);
               I := I + 1;
            else
               declare
                  Hour : Natural := 0;
                  C    : constant Natural := I + H;
               begin
                  for K in I .. C - 1 loop
                     Hour := Hour * 10 + Character'Pos (Item (K)) - 48;
                  end loop;
                  Hour := Hour mod 12 + (if Item (C + 4) = 'P' then 12 else 0);
                  Put ((Character'Val (48 + Hour / 10), Character'Val (48 + Hour mod 10)),
                       Result, Last);
                  Put (Item (C .. C + 2), Result, Last);
                  I := C + 6;
               end;
            end if;
         end;
      end loop;
   end Clock_24;

   procedure Quantity (L : Language; Item : String; U : Unit;
                       Result : in out String; Last : in out Natural) is
      --  Work in thousandths so no floating point is needed.
      Milli : Long_Long_Integer := 0;
      Scale : Long_Long_Integer := 1000;
      Seen_Dot : Boolean := False;
      Neg : constant Boolean := Item'Length > 0 and then Item (Item'First) = '-';
      Out_Milli : Long_Long_Integer;
   begin
      --  English is British: miles and mph stay, the rest goes metric.
      if L = EN and then (U = Miles or else U = Miles_Per_Hour) then
         Put (Item, Result, Last);
         Put ((if U = Miles then " mi" else " mph"), Result, Last);
         return;
      end if;
      for C of Item loop
         if Is_Digit (C) then
            if not Seen_Dot then
               Milli := Milli * 10 + Long_Long_Integer (Character'Pos (C) - 48) * 1000;
            elsif Scale > 1 then
               Scale := Scale / 10;
               Milli := Milli + Long_Long_Integer (Character'Pos (C) - 48) * Scale;
            end if;
         elsif C = '.' then
            Seen_Dot := True;
         end if;
      end loop;
      if Neg then
         Milli := -Milli;
      end if;
      Out_Milli :=
        (case U is
            when Acres          => Milli * 4_047 / 10_000,
            when Fahrenheit     => (Milli - 32_000) * 5 / 9,
            when Miles          => Milli * 1_609 / 1_000,
            when Miles_Per_Hour => Milli * 1_609 / 1_000,
            when Feet           => Milli * 3_048 / 10_000);
      declare
         Whole : constant Long_Long_Integer := (abs Out_Milli + 500) / 1000;
         Img   : String (1 .. 20);
         N     : Natural := Img'Last + 1;
         W     : Long_Long_Integer := Whole;
      begin
         loop                                   --  digits right to left
            N := N - 1;
            Img (N) := Character'Val (48 + Integer (W mod 10));
            W := W / 10;
            exit when W = 0;
         end loop;
         if Out_Milli < 0 and Whole > 0 then
            Put ("-", Result, Last);
         end if;
         Put_Number (L, Img (N .. Img'Last), "", Img'Last - N >= 4, Result, Last);
         Put ((case U is
                 when Acres          => " ha",
                 when Fahrenheit     => " " & Character'Val (16#C2#) & Character'Val (16#B0#) & "C",
                 when Miles          => " km",
                 when Miles_Per_Hour => " km/h",
                 when Feet           => " m"), Result, Last);
      end;
   end Quantity;

end UIM.Format;
