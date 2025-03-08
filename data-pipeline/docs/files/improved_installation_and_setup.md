
# Installation and Setup

## Table of Contents
- [DCT VM Build](#dct-vm-build)
- [Initial Ubuntu Install](#initial-ubuntu-install)
- [Post Installation Steps](#post-installation-steps)
- [Additional Configuration](#additional-configuration)

## DCT VM Build
This section outlines the build process for the DCT Virtual Machine (VM). The purpose of this document is to create a reproducible VM which can be built on any x86 compatible infrastructure to provide an ETL pipeline from an on-prem system to S3.

### Initial Ubuntu Install
1. Using your selected virtualization platform, create a new virtual machine. Recommended specifications are below; however, these will need to be adjusted in each environment and according to specific needs.
   - Recommended Specifications:
     - CPU: 4 cores
     - RAM: 8 GB
     - Storage: 256 GB SSD
   - Note: Adjust the specifications based on the requirements of your project.
2. Install Ubuntu 20.04 LTS on the virtual machine.
   - Follow the standard installation procedure.
   - Set up necessary partitions as per your infrastructure requirements.
3. Once Ubuntu is installed, proceed to the initial setup.

### Post Installation Steps
1. Update the system packages.
   ```
   sudo apt update
   sudo apt upgrade
   ```
2. Install necessary tools and dependencies.
   ```
   sudo apt install git curl wget
   ```

### Additional Configuration
1. Set up network configurations as required.
2. Configure firewall settings for security.
3. Document any specific steps taken during the installation for future reference.
