# Przemyslaw_Lewandowski_187755

Na branchy master rozwijana jest wersja na przeglądarki, jako, 
że dużą część gry piszę na laptopie, na którym niestety Visual Studio się nie mieści.

Na branchy visual natomiast, jest projekt z VS, do którego przenoszone są zmiany z mastera
i w miarę potrzeb dostosowywane.

##game_cfg.json
Plik konfiguracyjny gry. Poniżej są opisane jego pola i ich wartości.
* initScreen - jaki ekran pokazać po załadowaniu gry. Możliwe wartości:
	- editor
	- menu
	- cinematic - wymaga zahardcodowania, który cinematic załadować
	- game - wymaga zahardcodowania, który poziom załadować
	- chapter_choose - j.w.
	- level_choose - j.w.

* showBorderLines - czy pokazać boundingBoxy obiektów
	+ true
	+ false
