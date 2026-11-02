with UIM.Texts;  use UIM.Texts;
with UIM.Format; use UIM.Format;

procedure UIM.Translate (L : Language; Item : String;
                         Result : in out String; Last : out Natural) is

   Max_Numbers : constant := 8;
   type Slice is record
      First, Last : Natural := 0;
   end record;
   Numbers : array (1 .. Max_Numbers) of Slice;

   Clocked : String (1 .. Item'Length);
   Text_Last : Natural;

   procedure Put (S : String) is
   begin
      for C of S loop
         if Last < Result'Last then
            Last := Last + 1;
            Result (Last) := C;
         end if;
      end loop;
   end Put;

   --  Does English row Row match Clocked at From? If so, Next is the first
   --  position after the match and Numbers holds the numbers it used.
   function Match (Row : Positive; From : Positive; Next : out Natural)
     return Boolean
   is
      P     : constant String :=
        Pool (Start (Row, EN) .. Start (Row, EN) + Size (Row, EN) - 1);
      I     : Natural := From;
      Count : Natural := 0;
   begin
      Next := From;
      for J in P'Range loop
         if I > Text_Last then
            return False;
         elsif P (J) = '#' then
            declare
               N : constant Natural := Number_Length (Clocked (1 .. Text_Last), I);
            begin
               if N = 0 or else Count = Max_Numbers then
                  return False;
               end if;
               Count := Count + 1;
               Numbers (Count) := (I, I + N - 1);
               I := I + N;
            end;
         elsif P (J) = ' ' then      --  one space in a row = any run of spaces
            if Clocked (I) /= ' ' then
               return False;
            end if;
            while I <= Text_Last and then Clocked (I) = ' ' loop
               I := I + 1;
            end loop;
         elsif P (J) = Clocked (I) then
            I := I + 1;
         else
            return False;
         end if;
      end loop;
      --  whole words only: a row ending in a letter must not run into one
      if Is_Alnum (P (P'Last)) and then I <= Text_Last
        and then Is_Alnum (Clocked (I))
      then
         return False;
      end if;
      Next := I;
      return True;
   end Match;

   --  Write row Row in language L, filling each "#" with the next number.
   procedure Put_Row (Row : Positive) is
      T : constant String :=
        Pool (Start (Row, L) .. Start (Row, L) + Size (Row, L) - 1);
      K : Natural := 0;
   begin
      for C of T loop
         if C = '#' and then K < Max_Numbers and then Numbers (K + 1).First > 0 then
            K := K + 1;
            Number (L, Clocked (Numbers (K).First .. Numbers (K).Last), Result, Last);
         else
            Put ((1 => C));
         end if;
      end loop;
   end Put_Row;

   I : Natural := 1;
begin
   Last := Result'First - 1;
   if L = EN then
      Put (Item);
      return;
   end if;
   Clock_24 (Item, Clocked, Text_Last);

   while I <= Text_Last loop
      declare
         C     : constant Character := Clocked (I);
         Word  : constant Boolean := I = 1 or else not Is_Alnum (Clocked (I - 1));
         Key   : constant Character := (if Is_Digit (C) then '#' else C);
         Next  : Natural := 0;
         Found : Natural := 0;
      begin
         if Word then
            --  a row may start with the character itself or with "#"
            for Row in Texts.First (C) .. Texts.Last (C) loop
               Numbers := (others => <>);
               if Match (Row, I, Next) then
                  Found := Row;
                  exit;
               end if;
            end loop;
            if Found = 0 and then Key = '#' then
               for Row in Texts.First ('#') .. Texts.Last ('#') loop
                  Numbers := (others => <>);
                  if Match (Row, I, Next) then
                     Found := Row;
                     exit;
                  end if;
               end loop;
            end if;
         end if;

         if Found > 0 then
            Put_Row (Found);
            I := Next;
         elsif Is_Digit (C) and then Word
           and then (I = 1 or else Clocked (I - 1) not in '.' | ',')
         then
            --  a number on its own; left alone when glued to letters (0x4A2)
            declare
               N : constant Natural := Number_Length (Clocked (1 .. Text_Last), I);
            begin
               if I + N <= Text_Last and then Is_Ascii_Letter (Clocked (I + N)) then
                  Put (Clocked (I .. I + N - 1));
               else
                  Number (L, Clocked (I .. I + N - 1), Result, Last);
               end if;
               I := I + N;
            end;
         else
            Put ((1 => C));
            I := I + 1;
         end if;
      end;
   end loop;
end UIM.Translate;
