# How do you BI in Azure

Simon Whiteley & Terry McCann - Adatis

## CLoud BI

* Warehouse loading pattern.

``` demo
SSIS           SSIS            SSIS
Stage    =>    Clean    =>   Warehouse
```

* Previously, servers would be on premise.
* "Big Data" Solutions have been specific to software stacks.
* Common that previous architectures have been taken to the cloud.
  * These are not necessarily best placed for cloud.
* Sometimes, software stacks can prevent approach to better architectures.

| Hosting | Managment responsibility |
| -- | -- |
| On Prem | 100% |
| IaaS    | 50% |
| PaaS    | 25% |
| SaaS    | 0% |

___

| Storage | Compute | Orchestration | Visual |
| -- | -- | -- | -- |

* Storage
  * Structured
  * Unstructured
  * Semi-Structured
  * Scalable
* Compute
  * Batch
  * Stream
  * Scalable
  * On-Demand.
* Orchestration
  * Quick to Build.
  * Flexible.
  * Robust.
  * Scalable.
* Visual
  * Fast.
  * Easy.
  * Pretty.
  * SCALABLE.

___

### What We're Using

* Storage.
  * Flat files.
  * Data Lake Store / Blob storage.
* Compute.
  * <<MISSING>>.
  * Azure Data Warehouse (MPP).
    * Looks like SQL Server.
    * Only want to use that with 1TB data.
  * Event Data Events.
* Orchestration.
  * Logic Apps.
    * Lightweight app.
    * Think of [IFTTT](https://ifttt.com).
  * Data Factory.
    * Bigger batches.
* Visual.
  * PowerBI.

  ___

### Data Lake

#### What is a Data Lake

*Input flows > Data reservoir > Output flow*

* Storage Layer.
  * Web HDFS Architecture.
  * Any file type / size.
  * It splits files up behind the scene.
* The 3 V's of data
  * Volume
  * Velocity

#### Folder Structure

* Raw.
  * Initial version of data.
* Enriched.
* Curated.
* Laboratory.

#### Files - Things To Know

* Some files cannot be chunked.
  * e.g. JSON, XML, Zip files (they need to be read end to end).
* Don't bother to zip files going into Data Lake.
* Can prevent good performance.

#### Security

* Can be linked to Active Directory to allow permission to different folders / files.

#### Differences with Blob

* Blob is HGFS.
* Data Lake Store is a a bit more expensive.

___

## Data Factory

> "Its not SSIS in the cloud."

Create and orchestrate, and manage data movement and enrichment through the cloud.

### Linked Service
* Where data lives
* A linked service / data store is the definition of the connection to where our data resides (connection string).
* You have sources and sinks.
  * Sink is where its going (e.g. blob)

### Linked Datasets

###Linked Pipeline

Data factory is completely written in JSON.

___

## Azure SQL DataWarehouse

### MPP (Massively Parallel Processing)

* Each CPU is linked with a single storage.
* Lots of small things in parallel work fast.

### Concerns

* Scalability

### Cloud Setup

* 60 distributed nodes.
* 100 DWUs = 1 compute node / 8 readers.
* 200 DWUs = 2 compute nodes / 8 readers.
* ...
* 6000 DWUs = 60 compute nodes / 8 readers.

Benefits seen when working with TerraBytes of data.

## PolyBase

* Polybase is the only scalable solution.
* Available >= 2016 SQL Server.

## Distribution Data

Data can be spread by:

* Round robin.
* HASH column.
* Replicated.

## ELT > ETL

ETL > SSIS > SSIS > ...
ELT > Box > Box > ...

Writing stored procs forces node usage which makes it scaleable.

___

## Logic Apps

### Data Factory Limitations

* Not good at dependency paths.
* Not good at event driven things.

Logic Apps can react to things.
Data Factory waits to be called, Logic Apps can call it.
Lovechild of Biztalk and Interation services.

Its part of Microsoft Flow (MS Flow creates a logic app).
Logic Apps is the fully featured tool.

Azure Functions are the code based version.

* Connnector.
  * Integration with a service.
* Tiggers.
  * Things that we watch.
* Actions.
  * Things that we can do.

### This Is Not A Heavy Lifter

**This is for light data packages!**

They scale out.

___

## Notes

* Register where the data is coming from.
* Decided a good naming convention.