<template>
  <div class="rbac-admin max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
        <ShieldCheck class="w-8 h-8 text-primary" />
        Panel de Control RBAC
      </h1>
      <p class="mt-2 text-sm text-muted-foreground">
        Gestiona los accesos, permisos y roles de los usuarios de OppyTalent.
      </p>
    </div>

    <!-- Pestañas de Navegación -->
    <div class="border-b border-border/40 mb-6">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <button
          v-for="tab in ['Usuarios', 'Matriz de Permisos']"
          :key="tab"
          @click="activeTab = tab"
          :class="[
            activeTab === tab
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border/40',
            'whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors'
          ]"
        >
          {{ tab }}
        </button>
      </nav>
    </div>

    <!-- Vista de Usuarios -->
    <div v-if="activeTab === 'Usuarios'" class="space-y-6">
      <div class="glass-panel p-6 rounded-xl border border-border/40 bg-card/50 shadow-sm backdrop-blur-sm">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-foreground">Directorio de Usuarios</h2>
          <div class="relative max-w-sm w-full">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              v-model="searchUserQuery" 
              type="text" 
              placeholder="Buscar por usuario, email o nombre..." 
              class="w-full pl-9 pr-4 py-2 bg-background border border-border/40 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            >
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-muted-foreground">
            <thead class="text-xs text-foreground uppercase bg-secondary/50 border-b border-border/40">
              <tr>
                <th scope="col" class="px-4 py-3 rounded-tl-lg">ID</th>
                <th scope="col" class="px-4 py-3">Usuario</th>
                <th scope="col" class="px-4 py-3">Email</th>
                <th scope="col" class="px-4 py-3">Rol Actual</th>
                <th scope="col" class="px-4 py-3 text-right rounded-tr-lg">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.id" class="border-b border-border/20 hover:bg-secondary/30 transition-colors">
                <td class="px-4 py-3">{{ user.id }}</td>
                <td class="px-4 py-3 font-medium text-foreground">{{ user.username }}</td>
                <td class="px-4 py-3">{{ user.email }}</td>
                <td class="px-4 py-3">
                  <select 
                    v-model="user.role_id"
                    @change="updateUserRole(user.id, user.role_id)"
                    class="bg-background border border-border/40 text-foreground text-xs rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option :value="null">-- Sin Rol --</option>
                    <option v-for="role in roles" :key="role.id" :value="role.id">
                      {{ role.name }}
                    </option>
                  </select>
                </td>
                <td class="px-4 py-3 text-right flex justify-end gap-2">
                  <button 
                    v-if="user.role_id && authStore.user?.id !== user.id"
                    @click="impersonate(user.role_id)" 
                    title="Probar vista como este rol"
                    class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 rounded-md transition-colors"
                  >
                    <VenetianMask class="w-3 h-3" /> Impersonate
                  </button>
                </td>
              </tr>
              <tr v-if="filteredUsers.length === 0">
                <td colspan="5" class="px-4 py-8 text-center text-muted-foreground">
                  No se encontraron usuarios.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Matriz de Permisos -->
    <div v-if="activeTab === 'Matriz de Permisos'" class="space-y-6">
      <div class="glass-panel p-6 rounded-xl border border-border/40 bg-card/50 shadow-sm backdrop-blur-sm">
        <h2 class="text-lg font-semibold text-foreground mb-4">Matriz de Acceso Dinámica</h2>
        
        <div class="overflow-x-auto pb-4">
          <table class="w-full text-sm text-left text-muted-foreground border-collapse">
            <thead class="text-xs text-foreground uppercase bg-secondary/50">
              <tr>
                <th class="px-4 py-3 border border-border/40 w-1/4">Permiso / Rol</th>
                <th v-for="role in roles" :key="role.id" class="px-4 py-3 text-center border border-border/40">
                  <div class="font-bold text-primary">{{ role.name }}</div>
                  <div class="text-[10px] font-normal text-muted-foreground mt-1">{{ role.description }}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="permission in permissions" :key="permission.id" class="hover:bg-secondary/20 transition-colors">
                <td class="px-4 py-3 border border-border/40">
                  <div class="font-medium text-foreground">{{ permission.codename }}</div>
                  <div class="text-xs text-muted-foreground">{{ permission.description }}</div>
                </td>
                <td v-for="role in roles" :key="role.id" class="px-4 py-3 text-center border border-border/40">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      class="sr-only peer"
                      :checked="hasPermission(role, permission.id)"
                      @change="togglePermission(role.id, permission.id)"
                      :disabled="isUpdating"
                    >
                    <div class="w-9 h-5 bg-border/40 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { ShieldCheck, Search, VenetianMask } from 'lucide-vue-next';
import { api } from '../../services/api';
import { useAuthStore } from '../../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const activeTab = ref('Usuarios');
const isUpdating = ref(false);

const roles = ref([]);
const permissions = ref([]);
const users = ref([]);
const searchUserQuery = ref('');

onMounted(async () => {
  await loadData();
});

async function loadData() {
  try {
    const [rRes, pRes, uRes] = await Promise.all([
      api.getRoles(),
      api.getPermissions(),
      api.getRbacUsers()
    ]);
    roles.value = rRes;
    permissions.value = pRes;
    users.value = uRes;
  } catch (error) {
    console.error("Error al cargar datos RBAC:", error);
    alert("Hubo un error al cargar los datos. Revisa tus permisos.");
  }
}

const filteredUsers = computed(() => {
  if (!searchUserQuery.value) return users.value;
  const q = searchUserQuery.value.toLowerCase();
  return users.value.filter(u => 
    u.username.toLowerCase().includes(q) || 
    u.email.toLowerCase().includes(q) ||
    (u.first_name && u.first_name.toLowerCase().includes(q))
  );
});

function hasPermission(role, permissionId) {
  return role.permissions.some(p => p.id === permissionId);
}

async function togglePermission(roleId, permissionId) {
  isUpdating.value = true;
  try {
    await api.toggleRolePermission(roleId, permissionId);
    // Refresh roles to get updated permissions
    roles.value = await api.getRoles();
  } catch (error) {
    console.error("Error al alternar permiso:", error);
    alert("No se pudo actualizar el permiso.");
  } finally {
    isUpdating.value = false;
  }
}

async function updateUserRole(userId, newRoleId) {
  try {
    await api.updateUserRole(userId, newRoleId);
    // Notificamos sutilmente si quisieramos, pero el binding de Vue ya actualizó el select
  } catch (error) {
    console.error("Error al actualizar rol:", error);
    alert("No se pudo actualizar el rol del usuario.");
    await loadData(); // revert
  }
}

async function impersonate(roleId) {
  try {
    await authStore.impersonate(roleId);
    router.push('/b2b'); // Redirige al dashboard de b2b o home como prueba
  } catch (error) {
    console.error("Error al impersonar:", error);
    alert("No se pudo suplantar la identidad.");
  }
}

</script>

<style scoped>
.glass-panel {
  background: var(--color-gray-100);
  border: 1px solid var(--color-gray-200);
}
</style>
