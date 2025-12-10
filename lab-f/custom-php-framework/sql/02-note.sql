create table note
(
    id      integer not null
        constraint note_pk
            primary key autoincrement,
    title text not null,
    body text not null
);
