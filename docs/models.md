# Modele

## 1. Task

```
{
}
```

Opis: Model pojedynczego zadania

## 2. Backlog

```
{
}
```

Opis: Model pojedynczego backlogu

## 3. Sprint

```
{
}
```

Opis: Model pojedynczego sprintu


## 4. Team

```
{
}
```

Opis: Model pojedynczego zespołu

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