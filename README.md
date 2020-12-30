# joemojiprocess

# Overview

This is code that will ingest emoji.json and convert into a JSON file of stemmed keywords. This will allow one to search for these stemmed keywords in the file.

This code is horribly inefficient and memory/processor intensive. 

One very obvious improvement is to use an SQL server as opposed to holding the entire Map in memory. Another improvement would be to use Immutable.js so that multiple copies of the same object aren't hogging up memory. As of right now, I could use Postgresql to improve the code, but it should work for now.
