#!/usr/bin/env python
import urllib.request
import dns.resolver
import threading
import os
from time import sleep

def worker(url):
    """thread worker function"""
    try:
        print('starting request')
        resp = urllib.request.urlopen(url).read()
        print('completed request')
    except:        
        print('request failed')
        pass
    return

resolver = dns.resolver.Resolver()
resolver.nameservers = [os.environ['DnsNameServer']]

def lambda_handler(event, context):
    request_count = 0
    while True:
        request_count += 2
        #sleep(0.01) #100ms buffer to keep from getting throttled
        answer = resolver.query(os.environ['AppDomainName'], 'CNAME')
        for rdata in answer:
            url = ("http://%s" % rdata)[:-1]
            for i in range(1): # this is the # of threads, from 0 (e.g. 1 = 2 threads)
                t = threading.Thread(target=worker, args=(url,))
                t.start()