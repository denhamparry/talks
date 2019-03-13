# Docker London Talk

## Notes

* When it started, it was a core product so easy to use the term Docker.
* Through the years, that's changed as it has grown.
* Over time, there was increased complexity.
* Docker as open source / Docker Inc?
* Docker introduced a piece of software that revolutionised the industry.]
  * Docker Engine.
* The run operations build, push run and manage the life cycle of the operation.
* That was solving problems at a small skill, typically on a developer laptop.
* The problem was when they introduced other new technology on top of the docker engine.
* They included addition technology that would solve network, storage and clustering problems.
* You'd either get everything or nothing.
* The industry made some noise about this, there was rapid growth and people started to try and solve these problems in different ways.
  * Clustering was Swarm.

* They only needed the docker engine, not the rest.
* Container-D was part of the Docker engine.
* This became a module and extracted from the monolith.
* Project Moby is a branding name for everything that is Docker open source projects.
* Moby is a tool that allows you to compose these technologies into different products.
* Different artefacts come from Moby.
* For example:
  * Docker CE (Community edition).
    * Free and open source.
  * Docker EE (Enterprise edition).
    * Not so free.
* Consumer
  * Nothing much has changed.
  * Dependent on Moby artefact.
* Contributor
  * It started to change.
  * Focused on the modularisation.