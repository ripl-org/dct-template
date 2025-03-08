# Installation and Setup

## DCT VM Build
This section outlines the built process for the DCT Virtual Machine (VM). The purpose of this document is to create a 
repoducable VM which can be built on any x86 compatible infrastructure to provide an ETL pipeline from an on prem system 
to S3.

- Initial Ubuntu Install
	1. Using your selected virtualization platform create new virtual machine. Recommended specifications are below however these will need to be adjusted in each enviroment and according to load.
		* 4 CPU
		* 12GB RAM
		* 256GB HDD (thin provisioning OK)
		* Network connection capable of reaching Motorola Flex API Server
	2. Install OS in newly created Virtual Machine
		* RIPL recommends Ubuntu Desktop for ease of use however Ubuntu Server or any other Debian distribution should work as well.
		* Optional (but recommended) install the hypervisor toolset locally (ex: VMWare Tools).

- Airflow Install: To install Airflow open a terminal or SSH connection to the previously built Linux VM and execute the below setup process.

	```bash
  sudo apt update && sudo apt upgrade
  sudo apt-get install python3-pip mysql-server
 	```
 
     1.  Please ensure you first install, create and activate a python [virtual environment](https://docs.python.org/3/library/venv.html).
	```bash
   sudo apt-get install virtualenv
   virtualenv myenv
   source myenv/bin/activate
	```
    2. For the apache-airflow install, make sure to update the constraint file with your version of Python. More information on creating a reproducible airflow install [here](https://airflow.apache.org/docs/apache-airflow/stable/installation/installing-from-pypi.html).<br>
        * Example: `pip install "apache-airflow[celery]==2.8.1" --constraint "https://raw.githubusercontent.com/apache/airflow/constraints-2.8.1/constraints-3.8.txt"'
          
	```bash
	pip3 install "apache-airflow[celery]==2.6.2" --constraint "https://raw.githubusercontent.com/apache/airflow/constraints-2.6.2/constraints-<YOUR PYTHON VERSION>.txt"
	```
  
    3. Install Remaining Packages

    ```bash
  sudo apt install libmysqlclient-dev pkg-config
  sudo apt install python3-dev default-libmysqlclient-dev build-essential
  pip3 install mysqlclient==2.2.1
  pip3 install "apache-airflow[mysql]"
  pip3 install google-re2==1.1
  pip3 install redis
	```

- Airflow Database Setup: To setup the Airflow Database open a terminal or SSH connection to the previously built Linux VM and execute the below setup process.
    ```bash
    sudo mysql -u root -p
     ```
     ```mysql
    mysql>CREATE DATABASE airflow CHARACTER SET utf8 COLLATE utf8_unicode_ci; 
    mysql>create user 'airflow'@'localhost' identified by '***password***'; 
    mysql>grant all privileges on * . * to 'airflow'@'localhost'; 
    mysql>flush privileges; 
    mysql>quit 
    ``` 
 
- Initialize Airflow Database:
    ```bash
    export AIRFLOW_HOME=~/airflow
    airflow db init
    ```
    **Note:** This command performs several actions including:
    - Creating the `airflow.cfg` file in `$AIRFLOW_HOME` (default: `~/airflow`).
    - Setting up necessary tables in the database as specified in `airflow.cfg`.
    - Generating a folder structure within `$AIRFLOW_HOME`, including directories like `dags`, `logs`, and `plugins`. <br><br>
- Create an Admin User in Airflow
  ```
    airflow users create -u [username] -p [password] -f [firstname] -l [lastname] -e [email] -r Admin
  ```
- Update airflow.cfg file to reflect (defaults path is /home/*username*/airflow/airflow.cfg):
  	
    ```
    sql_alchemy_conn = mysql://airflow:***password***@localhost:3306/airflow
    executor = CeleryExecutor
    broker_url = redis://localhost:6379/0
    load_examples = False
    ```
    Afterwards rerun ```airflow db init``` (this will migrate from sqlite to msql database) 
    
- Check Airflow Instillation: <br><br>
    You can now check that your airflow instillation is set-up and running by running the command `airflow standalone`
  
## Environment Set-up
- Download Code Repository:
  - Create and set-up a [github account](https://github.com/) if you do not already have one. 
    - Navigate to the home directory on your virtual machine and run the following code in terminal.
	  ```bash
	  git clone https://github.com/ripl-org/dct-template.git
	  ```
- Move the following files and directories from the cloned repository into the Airflow home directory (created during database initialization):
    * dags/ 
    * scripts/ 
    * src/ 
    * requirements.txt 
    * docs/files/Example_Config.yaml (rename file to config.yaml)

- Setup directory structure: Create the following directory structure inside the Airflow home directory (some folders will already exist so be careful):
	```
	.
	├── dags # Already Exists
	├── data
	│   ├── raw
	│   │   ├── files
	│   │   └── database
	│   └── processed
	│   │   └── database
        │   ├── backup
 	│   │   ├── raw
	│   │   └── derived
	│   └── static
	├── logs # Already Exists
	├── reports
	├── scripts # Already Exists
	│   ├── extract # Already Exists
	│   ├── transform # Already Exists
	│   ├── load # Already Exists
	│   └── report # Already Exists
	├── secrets
	└── src # Already Exists
	```
 
- Install SQLite3 and R
    ```bash
    sudo apt install sqlite3=3.37.2-2ubuntu0.3
    sudo apt install r-base=4.1.2-1ubuntu2
    ```
  
- Install Python Packages: 
    ```bash
    pip3 install -r requirements.txt
    ```
- Setup config.yaml file: 
	`config.yaml` file should be saved in the airflow home directory (`~airflow`). Additional instructions for how to
	setup the config file can be found in the config file comments. <br><br>
  
- Setup SQLite Database: Navigate to `scripts/schema` directory and run the following code
    ```bash
    python3 schema_database_setup_derived_tables.py
    python3 schema_database_setup_raw_tables.py
    ```

- Install R Libraries: Navigate to `src` directory and run `src_setup_r_packages.R` file. **Note:** This may take several minutes.
    ```bash
    sudo Rscript src_setup_r_packages.R
    ```
## Setup Airflow as a System Service 
- Follow the steps laid out in [this article](https://janakiev.com/blog/apache-airflow-systemd/)
  
## External dependencies
- Setup AWS backend infrastructure: https://github.com/ripl-org/dct-template/backend/blob/main/backend/README.md <br><br>

- Obtain the S3 bucket name that will be used for pipeline data storage. Bucket was created in the previous step. 
    Once bucket name is obtained, update config.yaml AWS `bucket_name` variable. <br><br>

- Obtain AWS IAM Roles Anywhere Variables:
	In order to push data to AWS, users must obtain an IAM Roles Anywhere certificate and key. Please find documentation on
  	IAM Roles Anywhere [here](https://docs.aws.amazon.com/rolesanywhere/latest/userguide/introduction.html). <br><br>

	Once the certificate and key are obtained, 1) place them in the `/secrets` directory and 2) Update the AWS iamanywhere certificate and private_key variables in the config.yaml file with the name of your certificate and key.<br><br>

- Obtain SMTP email configuration variables from backend infrastructure
   	Once variables are obtained, update the airflow.cfg variables with the information

## Check Instillation and Setup
Check instillation and setup by doing a test run of the apache-airflow pipeline. For more information on running the pipeline read the [Usage Guide](./usage_guide.md) located in the `/docs` folder.

## References:
- https://s3.amazonaws.com/recipes.dezyre.com/use-emailoperator-airflow-dag/materials/Apache_Airflow_Installation_on_Ubuntu.pdf
- https://airflow.apache.org/docs/apache-airflow/stable/administration-and-deployment/production-deployment.html
- https://airflow.apache.org/docs/
- https://docs.aws.amazon.com/rolesanywhere/latest/userguide/introduction.html
- https://airflow.apache.org/docs/apache-airflow/stable/installation/installing-from-pypi.html
