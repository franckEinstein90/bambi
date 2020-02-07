#!/usr/bin/perl
use strict;
use warnings;

my $filename = "src/$ARGV[0]";
open(my $fh, '<:encoding(UTF-8)', $filename) or die "Couldn't open file '$filename' $!";
while(my $row = <$fh>){
    chomp $row;
    if ($row =~ /module\.exports/) {goto EXIT};
    print "$row\n" unless ($row =~ /var.*require/);
}

EXIT:
        

