# Talk

* Finding bugs in weeks and months costs money.
* Complicated code is more likely to get broken.
* Duplication in code is opposite of reuse.
* Refactoring duplicated code shows obstructions.
* Ripple effect.
  * One line of code breaks the whole code base.
  * Localise impact of those ripples.

## How do we avoid unclean code

### Shorten feedback loops

* More testers, longer legacy code
* We want it to be minutes, if not seconds.
* Fast automated unit tests without dependencies.

#### Simple design

* It works.
* Clearly reveals its intent.
* Free of duplication.
  * Unless it makes it harder to understand.
* Code is made out of simple parts.

#### SOLID Design

* Classes should only do one job.
* Smaller parts are easier to understand and less likely to go wrong.

#### Tell, don't ask

* Objects that know stuff / Objects that do stuff.
* You have the data, you tell me the risk.
* Don't need to past data around.
* e.g. Customer knows their DOB, so they should tell their age.

#### Swapable Dependencies

* Swapable by default.
* If we need to change existing code, that's part of the ripple effect.
* Dependency injection (its not a framework).
> Book reference: Steve Freeman / Nat Price - Flex points.
* Reduce couplings, but we're going to have to have some.
* Swappable by default.
* They need to know as little as possible, what they do know needs to be swappable.

> The average cost of changing some code reduces.

* Michael Feather book > Refactoring book.

> Deliver now, but deliver for change

## Readable Code

[wordle.net](http://www.wordle.net/create)

* Use a tag cloud see what a customer calls their objects.

## Duplication Code

* How clean is your test code.

## Complex ability

* One method should do one thing.

### Feature envy

* When a feature of one class has envy of another class, which suggests its in the wrong class.

### Swapable

* Static classes cannot have an interface.
* 'I' in the interface is only used in the dotnet world.

* https://github.com/jasongorman/dotnetcodecraft