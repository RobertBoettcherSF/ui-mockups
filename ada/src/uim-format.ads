--  Numbers, 12/24 h clock and units, written the way each language does.
package UIM.Format is

   --  English number text (comma = thousands, dot = decimals) rewritten
   --  for L:  "1,234.5"  ->  "1.234,5" (DE, ES)  or  "1 234,5" (FR).
   --  Numbers without commas get no group marks: "47205" stays "47205".
   --  Texts with two or more dots (versions, addresses) come back unchanged.
   procedure Number (L : Language; Item : String;
                     Result : in out String; Last : in out Natural);

   --  "5:47 PM" -> "17:47". Rewrites every such clock time in Item.
   procedure Clock_24 (Item : String;
                       Result : in out String; Last : out Natural);

   --  Units the mockups use in English that are not metric.
   type Unit is (Acres, Fahrenheit, Miles, Miles_Per_Hour, Feet);

   --  A quantity in an English unit, shown in L. English keeps the number
   --  as it is (no unit is added); the others get the metric value + unit.
   procedure Quantity (L : Language; Item : String; U : Unit;
                       Result : in out String; Last : in out Natural);

   function Is_Digit (C : Character) return Boolean is (C in '0' .. '9');
   function Is_Letter (C : Character) return Boolean is
     (C in 'a' .. 'z' | 'A' .. 'Z' or else Character'Pos (C) >= 128);
   function Is_Ascii_Letter (C : Character) return Boolean is
     (C in 'a' .. 'z' | 'A' .. 'Z');
   function Is_Alnum (C : Character) return Boolean is
     (Is_Digit (C) or else Is_Letter (C));

   --  Length of the number token at Item (From): digits, and "," or "."
   --  only when a digit follows. 0 when Item (From) is not a digit.
   function Number_Length (Item : String; From : Positive) return Natural;

end UIM.Format;
