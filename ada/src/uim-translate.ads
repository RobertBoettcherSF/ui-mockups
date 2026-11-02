--  Turns an English on-screen text into language L.
--  English comes back unchanged. For the others: 12 h clock times become
--  24 h, every row of UIM.Texts found inside the text is replaced (longest
--  row first, whole words only, "#" = a number) and the remaining numbers
--  get the decimal comma and group marks of L.
procedure UIM.Translate (L : Language; Item : String;
                         Result : in out String; Last : out Natural);
