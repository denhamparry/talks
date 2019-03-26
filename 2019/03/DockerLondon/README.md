# Docker London Talk

## Notes

* Before containers we were using Virtual Machines.
* VMs were a layer between the physical hardware and the operating system.
* The VM would manage the NIC, storage and size of it, whilst connecting to a ubiquitous layer.
* The VM would use a hypervisor which would manage the connections to the actual hardware.

* Docker engine is located within the Operating System.
* Within our application, we'd have a layer stating our operation dependencies.
* This becomes our container.
* The OS layer doesn't require the dependencies for the application, as this is specified within the application.

* Ansible, Chef and Puppet would create the dependencies within the OS layer for the application.

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