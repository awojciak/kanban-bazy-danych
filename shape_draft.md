# Draft kształtu bazy danych


1. Task
* nazwa: string
* czas: number
* opis: string
* wykonwaca: wskazanie
* backlog: wskazanie
* status: enum
* tagi: tablica<string>
* czy zablokowany: boolean

2. Backlog
* nazwa: string
* effort: string
* opis: string
* sprint: wskazanie
* tagi: tablica<string>
* czy zablokowany: boolean

3. Sprint
* numer: number
* zespół: wskazanie
* capacity: number

4. Zespół
* nazwa: string

5. Osoba
* imię: string
* nazwisko: string
* wymiar etatu: number
