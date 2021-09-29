library(readr)
library(dplyr)

sparrow_data <- read_csv("dir to the sparrow data in csv format")
iced_data <- read_csv("dir to the ice-d data in csv format")

# inner join to check duplicate records by "sample_name"
df= sparrow_data %>% inner_join(iced_data,by="sample_name")
