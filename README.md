# CSV List Processing

- This API enables processing of large CSV files efficiently.
- Leverages `Bull MQ` to process CSV files in background.
- `Bull MQ` is **Redis** based Message Queue that enables parallel processing of background jobs.

# How to run locally:

1. Make sure you have **Redis** installed in your system. [click here](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/) to install if Redis is not already installed.
2. Open terminal in root directory. Run folloiwng command in terminal to run the project

```bash
node server.js
```

3. Use postman or any other API platform to test different endpoints.

# Test Deployed version

1. URL: [https://mathongo-list-processor-assignment.onrender.com](https://mathongo-list-processor-assignment.onrender.com)
2. Postman Collection: [https://www.postman.com/crimson-meadow-10728/workspace/mypublicworkspace/request/16926172-be0e62f5-71a1-4868-9744-4eb704c52728](https://www.postman.com/crimson-meadow-10728/workspace/mypublicworkspace/request/16926172-be0e62f5-71a1-4868-9744-4eb704c52728)
