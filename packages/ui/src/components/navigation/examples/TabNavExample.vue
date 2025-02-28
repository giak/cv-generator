<template>
  <div class="tabnav-examples p-6 space-y-8 max-w-3xl mx-auto bg-neutral-900 rounded-lg">
    <h2 class="text-xl font-semibold text-white mb-4">TabNav Examples</h2>
    
    <!-- Exemple de base -->
    <section>
      <h3 class="text-lg font-medium text-white mb-2">Basic Tabs</h3>
      <TabNav v-model="activeTab1">
        <TabNavItem value="profile" label="Profile" />
        <TabNavItem value="settings" label="Settings" />
        <TabNavItem value="notifications" label="Notifications" />
        
        <template #content>
          <TabContent value="profile">
            <div class="p-4 bg-neutral-800 rounded-b-md">
              <h4 class="text-white font-medium mb-2">Profile Content</h4>
              <p class="text-neutral-300">This is the profile tab content.</p>
            </div>
          </TabContent>
          <TabContent value="settings">
            <div class="p-4 bg-neutral-800 rounded-b-md">
              <h4 class="text-white font-medium mb-2">Settings Content</h4>
              <p class="text-neutral-300">This is the settings tab content.</p>
            </div>
          </TabContent>
          <TabContent value="notifications">
            <div class="p-4 bg-neutral-800 rounded-b-md">
              <h4 class="text-white font-medium mb-2">Notifications Content</h4>
              <p class="text-neutral-300">This is the notifications tab content.</p>
            </div>
          </TabContent>
        </template>
      </TabNav>
    </section>
    
    <!-- Exemple de variantes -->
    <section>
      <h3 class="text-lg font-medium text-white mb-2">Tab Variants</h3>
      <div class="space-y-6">
        <div>
          <p class="text-neutral-400 mb-2">Minimal</p>
          <TabNav variant="minimal" v-model="activeTab2" bordered>
            <TabNavItem value="tab1" label="Tab 1" />
            <TabNavItem value="tab2" label="Tab 2" />
            <TabNavItem value="tab3" label="Tab 3" />
          </TabNav>
        </div>
        
        <div>
          <p class="text-neutral-400 mb-2">Underline</p>
          <TabNav variant="underline" v-model="activeTab3">
            <TabNavItem value="tab1" label="Tab 1" />
            <TabNavItem value="tab2" label="Tab 2" />
            <TabNavItem value="tab3" label="Tab 3" />
          </TabNav>
        </div>
        
        <div>
          <p class="text-neutral-400 mb-2">Contained</p>
          <TabNav variant="contained" v-model="activeTab4">
            <TabNavItem value="tab1" label="Tab 1" />
            <TabNavItem value="tab2" label="Tab 2" />
            <TabNavItem value="tab3" label="Tab 3" />
          </TabNav>
        </div>
      </div>
    </section>
    
    <!-- Exemple vertical -->
    <section>
      <h3 class="text-lg font-medium text-white mb-2">Vertical Tabs</h3>
      <TabNav v-model="activeTab5" vertical>
        <TabNavItem value="account" label="Account" />
        <TabNavItem value="security" label="Security" />
        <TabNavItem value="privacy" label="Privacy" />
        
        <template #content>
          <TabContent value="account">
            <div class="p-4 bg-neutral-800 rounded-md">
              <h4 class="text-white font-medium mb-2">Account Settings</h4>
              <p class="text-neutral-300">Configure your account settings here.</p>
            </div>
          </TabContent>
          <TabContent value="security">
            <div class="p-4 bg-neutral-800 rounded-md">
              <h4 class="text-white font-medium mb-2">Security Settings</h4>
              <p class="text-neutral-300">Manage your security preferences.</p>
            </div>
          </TabContent>
          <TabContent value="privacy">
            <div class="p-4 bg-neutral-800 rounded-md">
              <h4 class="text-white font-medium mb-2">Privacy Settings</h4>
              <p class="text-neutral-300">Adjust your privacy controls.</p>
            </div>
          </TabContent>
        </template>
      </TabNav>
    </section>
    
    <!-- Exemple avec icônes et badges -->
    <section>
      <h3 class="text-lg font-medium text-white mb-2">Tabs with Icons and Badges</h3>
      <TabNav v-model="activeTab6">
        <TabNavItem value="home">
          <template #icon>
            <HomeIcon />
          </template>
          Home
        </TabNavItem>
        <TabNavItem value="messages" badge="5" badgeVariant="primary">
          <template #icon>
            <MessageIcon />
          </template>
          Messages
        </TabNavItem>
        <TabNavItem value="alerts" badge="New" badgeVariant="warning">
          <template #icon>
            <AlertIcon />
          </template>
          Alerts
        </TabNavItem>
      </TabNav>
    </section>
    
    <!-- Exemple avec transitions -->
    <section>
      <h3 class="text-lg font-medium text-white mb-2">Tabs with Transitions</h3>
      <TabNav v-model="activeTab7">
        <TabNavItem value="fade" label="Fade" />
        <TabNavItem value="slide" label="Slide" />
        <TabNavItem value="zoom" label="Zoom" />
        
        <template #content>
          <TabContent value="fade" transition transitionType="fade">
            <div class="p-4 bg-neutral-800 rounded-b-md">
              <h4 class="text-white font-medium mb-2">Fade Transition</h4>
              <p class="text-neutral-300">This content uses a fade transition.</p>
            </div>
          </TabContent>
          <TabContent value="slide" transition transitionType="slide">
            <div class="p-4 bg-neutral-800 rounded-b-md">
              <h4 class="text-white font-medium mb-2">Slide Transition</h4>
              <p class="text-neutral-300">This content uses a slide transition.</p>
            </div>
          </TabContent>
          <TabContent value="zoom" transition transitionType="zoom">
            <div class="p-4 bg-neutral-800 rounded-b-md">
              <h4 class="text-white font-medium mb-2">Zoom Transition</h4>
              <p class="text-neutral-300">This content uses a zoom transition.</p>
            </div>
          </TabContent>
        </template>
      </TabNav>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { TabNav, TabNavItem, TabContent } from '../index';

// Onglets actifs pour chaque exemple
const activeTab1 = ref('profile');
const activeTab2 = ref('tab1');
const activeTab3 = ref('tab1');
const activeTab4 = ref('tab1');
const activeTab5 = ref('account');
const activeTab6 = ref('home');
const activeTab7 = ref('fade');

// Composants d'icônes simulés
const HomeIcon = {
  template: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>'
};

const MessageIcon = {
  template: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>'
};

const AlertIcon = {
  template: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>'
};
</script> 