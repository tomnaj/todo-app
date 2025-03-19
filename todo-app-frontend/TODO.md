[ ] - zmiana struktury 
        1. Dodanie folderu pages, który zawiera całą logikę dla danych modułów - czyli masz folder pages/tasks i w środku wszystkie pliki dla modułu tasks
        2. Folder "components" to folder dla componentów, które są reuzywalne - stąd pliki z tego folder do przeniesienia do pages/tasks
[ ] - dodanie routingu
        1. implementacja biblioteki react-router - https://reactrouter.com/start/declarative/routing
        2. utworzenie route dla /login, /register, /tasks + dla tworzenia, edycji oraz szczegółów tasków
[ ] - rejestracja uzytkownika
        1. dodanie formularza umozliwiającego rejestracje uzytkownika w systemie 
        2. walidacja formularza (react-hook-form + zod)
[ ] - logowanie zarejestrowanego uzytkownika 
        1. formularz logowania + trzymanie tokena 
        2. po pomyślnym zalogowaniu przejście do listy tasków


Przykładowe działanie aplikacji:
1. Uzytkownik rejestruje się w systemie, po pomyślnej rejestracji jest przenoszony do formularza logowania
2. Po zalogowaniu się do systemu, uzytkownik ma dostęp do listy swoich tasków oraz całego CRUDa
3. Nie moze być mozliwości dostania się do route /tasks + CRUD tasków bez posiadania waznego tokena
4. Kazdy uzytkownik w systemie widzi tylko swoje taski

Zmiany w API:
1. Utworzenie tabeli users i zapisywanie zarejestrowanego uzytkownika
2. Do tabeli tasks dodanie relacji many-to-one (wiele tasków dla jednego usera)
2. Funkcjonalność autentykacji - https://docs.nestjs.com/security/authentication
3. Tylko zalogowany uzytkownik (z waznym tokenem) moze korzystać z CRUDa tasków
