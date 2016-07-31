# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.network "private_network", type: "dhcp"

  require 'yaml'
  group_vars = YAML.load_file('provisioning/group_vars/vagrant')
  config.vm.hostname = group_vars["server_name"]

  config.hostmanager.enabled = true
  config.hostmanager.manage_host = true
  config.hostmanager.ignore_private_ip = true
  config.hostmanager.include_offline = false

  cached_addresses = {}
  config.hostmanager.ip_resolver = proc do |vm, resolving_vm|
    if cached_addresses[vm.name].nil?
      if hostname = (vm.ssh_info && vm.ssh_info[:host])
        vm.communicate.execute("/sbin/ifconfig eth1 | grep 'inet addr' | tail -n 1 | egrep -o '[0-9\.]+' | head -n 1 2>&1") do |type, contents|
          cached_addresses[vm.name] = contents.split("\n").first[/(\d+\.\d+\.\d+\.\d+)/, 1]
        end
      end
    end
    cached_addresses[vm.name]
  end

  config.vm.synced_folder ".", "/vagrant/#{config.vm.hostname}", type: "nfs", mount_options: ['actimeo=2']
  config.bindfs.bind_folder "/vagrant/#{config.vm.hostname}", "/vagrant/#{config.vm.hostname}"

  config.vm.synced_folder "/var/www/voicechat.dev/public", "/var/www/voicechat.dev/public", type: "nfs", mount_options: ['actimeo=2']
  config.bindfs.bind_folder "/var/www/voicechat.dev/public", "/var/www/voicechat.dev/public"

  config.vm.provider "virtualbox" do |vb|
    vb.memory = "2048"
    vb.cpus = 2
  end

  config.vm.provision "ansible", run: "always"  do |ansible|
    ansible.playbook = "provisioning/provision.yml"
    ansible.groups = {
      "vagrant" => ["default"],
      "webservers" => ["default"],
      "dbservers" => ["default"]
    }
  end
end
