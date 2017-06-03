#!/usr/bin/env python
import logging
import urllib2
import dns.resolver
import threading
import os
from time import sleep

def worker(url):
    """thread worker function"""
    try:
        logger.info('starting request')
        resp = urllib.request.urlopen(url).read()
        logger.info('completed request')
    except:        
        print('request failed')
        pass
    return

logger = logging.getLogger()
logger.setLevel(logging.INFO)

resolver = dns.resolver.Resolver()
resolver.nameservers = [os.environ['DnsNameServer']]

def lambda_handler(event, context):
    logger.info('dnsRR handler')   
    request_count = 0
    while True:
        request_count += 2
        #sleep(0.01) #100ms buffer to keep from getting throttled
        logger.info('querying dns')
        answer = resolver.query(os.environ['AppDomainName'], 'CNAME')
        logger.info('received response{}'.format(answer))
        for rdata in answer:
            url = ("http://%s" % rdata)[:-1]
            for i in range(1): # this is the # of threads, from 0 (e.g. 1 = 2 threads)
                t = threading.Thread(target=worker, args=(url,))
                t.start()