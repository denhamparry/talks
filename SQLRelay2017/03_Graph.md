# What are graphs

@sqlshark

[Slides](http://bit.ly/2uHQS74)

## The History

* Konigsberg Bridge Problem.
  * Not able to make any of the routes across bridges.
  * Whats the mathematical proof that this cannot be achieved.
  * Leonhard Eular - you know, that maths guy.
  * Land masses became *nodes*.
  * Bridges allow connectivity known as an *edge*.
    * An edge shows connection between bodes.
  * Count number of edges on nodes.
  * Solved by only odd numbers per node.
    * Bridges were bombed during the war making the problem solvable.
  * This became *Graph Theory*.

## The Problem With Relational Databases

* It's based on relational theory.
  * e.g. Movie db.
  * Person => Actor => Movie <= Director <= Person.
* Impedance Mismatch.
  * Multiple tables to manage a single view.
  * e.g. Order form.
  * Do you have to create null table records?
  * Can you store it as a JSON document?
* Complex to model.
* More data = Poor performance.

## Polyglot Persistence

**Use the best practice to store the data.**

* MapReduce (Google) > BigTable (Google) > Dynamo (Amazon)
* Shopping cart / Session / Completed Orders data not required in relational database.
* Better to store in a key value store db.

**Node    Event   Node**
**Person    >     Movie**

* A person can be in a movie but a movie cannot be in a person.

Entities become our nodes.
FK/PK / Many-Tp-Many become our edges.
Attributes joins become edges with properties.

**REVIEW ASH => ALIENS SLIDE**

* Shorted path between 2 nodes.
  * e.g. LinkedIn => Find shorted path between people.
* Transitive Closure.
  * Find all the nodes n hops away from where I am now.
* Polymorphism.
  * **TO ADD**

### Social Graph

* Who knows who.
* How Do We Find Queen Bees.

### Fraud Detection

* Spot rings of fraudulent activity.

### Recommendation

* Bob bought X, so did Y, Y also bought this.

### Network & IT

* Understand the inter connectivity of your network.

## How Does This Relate To SQL

* SQL 2017 - Now supports graph objects and graph queries.
* Putting it next to the relational data, not further away.
* Can now create tables as NODE.
* Implicit *$node_id* is created.
* Can now create tables as EDGE.
* EDGE populates *$node_id*'s from 2 Tables.
* MATCH:  ASCII ART Syntax.
  * e.g. WHERE MATCH (U1 - (R1) -> M <- (R2) - U2).
  * Show users who recommended the same movie.
  * U = user / R = recommendation / M = movie.

**REVIEW - Neo4J execution times.**

*Execution times remain static with increase of hops.*

## Limitations

1. Cannot do shortest path.
2. Transitive closure.
3. Polymorphism.

## NOTES

* NoSQL = Not Only SQL
* Book / YouTube: NoSQL Distilled - Martin Fowler