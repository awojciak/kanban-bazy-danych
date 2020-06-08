# Modele

## 1. Task

```
{
    name: String,
    plannedTime: Number,
    spentTime: Number,
    description: String,
    person: ObjectId,
    backlog: ObjectId,
    status: String,
    tags: [String],
    blocked: Boolean
}
```

Opis: Model pojedynczego zadania

name - nazwa zadania
plannedTime - planowany czas na wykonanie zadania
spentTime - czas dotychczas spędzony na wykonywaniu zadania
description - opis zadania
person - id wykonawcy zadania
backlog - id backlogu, do którego należy zadanie
status - status zadania
tags - tagi zadania
blocked - czy zadanie jest zablokowane

## 2. Backlog

```
{
    name: String,
    effort: Number,
    description: String,
    sprintForTeam: ObjectId,
    blocked: Boolean,
    tags: String
}
```

Opis: Model pojedynczego backlogu

name - nazwa backlogu
effort - ilość punktów effortu
description - opis backlogu
sprintForTeam - id tablicy, do której należy backlog
blocked - czy backlog jest zablokowany
tags - tagi backlogu

## 3. Sprint

```
{
    number: Number,
    start: Date,
    end: Date,
    sprintForTeams: [ObjectId]
}
```

Opis: Model pojedynczego sprintu

number - unikalny numer sprintu
start - data początku sprintu
end - data końca sprintu
sprintForTeams - tablica id wszystkich tablic przyporządkowanych do sprintu


## 4. Team

```
{
    name: String,
    members: [ObjectId],
    sprintsForTeam: [ObjectId]
}
```

Opis: Model pojedynczego zespołu

name - nazwa zespołu
members - tablica id wszystkich członków zespołu
sprintsForTeam - tablica id wszystkich tablic dla zespołu

## 5. SprintForTeam

```
{
    sprint: ObjectId,
    team: ObjectId,
    goal: String,
}
```

Opis: Model pojedynczej tablicy

sprint - id sprintu, dla którego obowiązuje tablica
team - id zespołu, do którego należy tablica
goal - cel sprintu, informacja pojawiająca się na górze tablicy, jeżeli jest niepusta

## 6. Person

```
{
    name: String,
    surname: String,
    timePart: Number
}
```

Opis: Model pojedynczej osoby

name - imię
surname - nazwisko
timePart - wymiar etatu (od 0 do 1)