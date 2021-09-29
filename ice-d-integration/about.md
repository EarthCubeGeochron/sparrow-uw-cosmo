## Cross-check between ICE-D Alpine and Sparrow WiscCosmo databases

The R file under this directory is an example demonstrating a quick way to cross-check duplicated records between ICE-D and Sparrow databases.

The ICE-D Apline data are exported via the Sequal tunnel and saved as a csv file. Greenland and AA data are not currently included.

A inner join by "sample_name" will return a dataframe containing all duplicated records.

Currently, there are about 17 thousand data in Sparrow and all of them are either 10Be or 26Al.  

There are about 9000 data in the ICE-D and they include some other chronometers like 36Cl, 3He and 14C.

There are 333 duplicated records between these databases by the "sample_name",  but there isn't a universal unique id for those cosmo samples so this might need to be double checked.
