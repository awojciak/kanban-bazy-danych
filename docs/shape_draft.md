# Draft kształtu bazy danych


## 1. Task
* nazwa: string
* całkowity czas: number
* czas dotychczas spędzony: number
* opis: string
* wykonwaca: wskazanie
* backlog: wskazanie
* status: enum
* tagi: tablica<string>
* czy zablokowany: boolean

## 2. Backlog
* nazwa: string
* effort: string
* opis: string
* sprint: wskazanie
* tagi: tablica<string>
* czy zablokowany: boolean

## 3. Sprint zespołu
* sprint: wskazanie
* zespół: wskazanie
* capacity: number

## 4. Sprint
* numer: number
* sprinty zespołów: tablica<wskazanie>
* początek: data
* koniec: data

## 5. Zespół
* nazwa: string
* członkowie: tablica<wskazanie>

## 6. Osoba
* imię: string
* nazwisko: string
* wymiar etatu: number
