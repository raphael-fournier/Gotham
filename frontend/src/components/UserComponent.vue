<template>
  <v-card class="wt mb-5">
    <v-row class="pa-3" align="center">
      <v-col xs="6" md="3">
        {{ user.username }}
      </v-col>
      <v-col xs="6" md="3">
        {{ user.role }}
      </v-col>
      <v-col v-if="page === 'account'" xs="8" md="3">
        <v-tooltip bottom v-if="page === 'account'">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon @click="promoteUser" :disabled="user.role === 'manager'" color="primary" class="mr-2" v-bind="attrs" v-on="on">
              <v-icon>mdi-arrow-up-bold-hexagon-outline</v-icon>
            </v-btn>
          </template>
          <span>Promote User</span>
        </v-tooltip>
        <v-tooltip bottom v-if="page === 'account'">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon @click="demoteUser" :disabled="user.role === 'user'" color="primary" v-bind="attrs" v-on="on">
              <v-icon>mdi-arrow-down-bold-hexagon-outline</v-icon>
            </v-btn>
          </template>
          <span>Demote User</span>
        </v-tooltip>
      </v-col>
      <v-spacer/>
      <v-col xs="4" md="3">
        <v-tooltip bottom v-if="page === 'account'">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon @click="deleteUser" color="primary" v-bind="attrs" v-on="on">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
          <span>Delete User Account</span>
        </v-tooltip>
        <v-tooltip bottom v-else-if="page === 'team'">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon @click="addUserToTeam" color="primary" v-bind="attrs" v-on="on">
              <v-icon>mdi-plus-box-outline</v-icon>
            </v-btn>
          </template>
          <span>Add User to Team</span>
        </v-tooltip>
        <v-tooltip bottom v-else-if="page === 'dashboard'">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon @click="viewUserDashboard" color="primary" v-bind="attrs" v-on="on">
              <v-icon>mdi-view-dashboard</v-icon>
            </v-btn>
          </template>
          <span>View User Dashboard</span>
        </v-tooltip>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: "SingleUserComponent",
  props: ["user", "page"],
  data() {
    return {};
  },
  methods: {
    promoteUser() {
      this.$store.dispatch("promoteUser", this.user.id);
    },
    demoteUser() {
      this.$store.dispatch("demoteUser", this.user.id);
    },
    deleteUser() {
      this.$store.dispatch("deleteUserById", this.user.id);
    },
    addUserToTeam() {
      this.$emit("addUser", this.user.id);
    },
    viewUserDashboard() {
      this.$router.push({name: "Dashboard", params: {mode: "individual"}, query: {userId: this.user.id.toString()}});
    }
  }
};
</script>