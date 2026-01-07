<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Data Backup & Recovery
          </h1>
          <p class="text-gray-600 mt-2">Secure your data with automated backups and recovery options</p>
        </div>
        <div class="flex items-center space-x-4">
          <button 
            @click="$router.back()"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-classroom transition-colors flex items-center space-x-2"
          >
            <span class="material-icons text-sm">arrow_back</span>
            <span>Back</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-6xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Backup Operations -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Quick Backup Actions -->
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-8 h-8 bg-blue-100 rounded-classroom flex items-center justify-center">
                <span class="material-icons text-blue-600 text-sm">backup</span>
              </div>
              <h2 class="text-xl font-bold text-gray-900">Quick Backup Actions</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Full System Backup -->
              <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-classroom p-6 border border-blue-200">
                <div class="flex items-center space-x-3 mb-4">
                  <div class="w-10 h-10 bg-blue-200 rounded-classroom flex items-center justify-center">
                    <span class="material-icons text-blue-600 text-lg">cloud_upload</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">Full System Backup</h3>
                    <p class="text-sm text-gray-600">Complete platform backup</p>
                  </div>
                </div>
                <div class="space-y-3">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">Estimated size:</span>
                    <span class="font-medium">2.4 GB</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">Last backup:</span>
                    <span class="font-medium">12 hours ago</span>
                  </div>
                  <button 
                    @click="startFullBackup"
                    :disabled="backupInProgress"
                    class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-2 rounded-classroom transition-colors flex items-center justify-center space-x-2"
                  >
                    <span v-if="backupInProgress" class="material-icons text-sm animate-spin">refresh</span>
                    <span v-else class="material-icons text-sm">cloud_upload</span>
                    <span>{{ backupInProgress ? 'Backing Up...' : 'Start Backup' }}</span>
                  </button>
                </div>
              </div>

              <!-- Database Only -->
              <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-classroom p-6 border border-green-200">
                <div class="flex items-center space-x-3 mb-4">
                  <div class="w-10 h-10 bg-green-200 rounded-classroom flex items-center justify-center">
                    <span class="material-icons text-green-600 text-lg">storage</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">Database Only</h3>
                    <p class="text-sm text-gray-600">User data and content</p>
                  </div>
                </div>
                <div class="space-y-3">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">Estimated size:</span>
                    <span class="font-medium">1.2 GB</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">Last backup:</span>
                    <span class="font-medium">1 day ago</span>
                  </div>
                  <button 
                    @click="startDatabaseBackup"
                    :disabled="backupInProgress"
                    class="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white py-2 rounded-classroom transition-colors flex items-center justify-center space-x-2"
                  >
                    <span v-if="backupInProgress" class="material-icons text-sm animate-spin">refresh</span>
                    <span v-else class="material-icons text-sm">storage</span>
                    <span>{{ backupInProgress ? 'Backing Up...' : 'Backup Database' }}</span>
                  </button>
                </div>
              </div>

              <!-- Configuration Files -->
              <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-classroom p-6 border border-purple-200">
                <div class="flex items-center space-x-3 mb-4">
                  <div class="w-10 h-10 bg-purple-200 rounded-classroom flex items-center justify-center">
                    <span class="material-icons text-purple-600 text-lg">settings</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">Configuration</h3>
                    <p class="text-sm text-gray-600">System settings and config</p>
                  </div>
                </div>
                <div class="space-y-3">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">Estimated size:</span>
                    <span class="font-medium">45 MB</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">Last backup:</span>
                    <span class="font-medium">3 days ago</span>
                  </div>
                  <button 
                    @click="startConfigBackup"
                    :disabled="backupInProgress"
                    class="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white py-2 rounded-classroom transition-colors flex items-center justify-center space-x-2"
                  >
                    <span v-if="backupInProgress" class="material-icons text-sm animate-spin">refresh</span>
                    <span v-else class="material-icons text-sm">settings</span>
                    <span>{{ backupInProgress ? 'Backing Up...' : 'Backup Config' }}</span>
                  </button>
                </div>
              </div>

              <!-- Media Files -->
              <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-classroom p-6 border border-orange-200">
                <div class="flex items-center space-x-3 mb-4">
                  <div class="w-10 h-10 bg-orange-200 rounded-classroom flex items-center justify-center">
                    <span class="material-icons text-orange-600 text-lg">folder</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">Media Files</h3>
                    <p class="text-sm text-gray-600">Uploads and documents</p>
                  </div>
                </div>
                <div class="space-y-3">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">Estimated size:</span>
                    <span class="font-medium">980 MB</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">Last backup:</span>
                    <span class="font-medium">6 hours ago</span>
                  </div>
                  <button 
                    @click="startMediaBackup"
                    :disabled="backupInProgress"
                    class="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white py-2 rounded-classroom transition-colors flex items-center justify-center space-x-2"
                  >
                    <span v-if="backupInProgress" class="material-icons text-sm animate-spin">refresh</span>
                    <span v-else class="material-icons text-sm">folder</span>
                    <span>{{ backupInProgress ? 'Backing Up...' : 'Backup Media' }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Backup Schedule -->
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-8 h-8 bg-green-100 rounded-classroom flex items-center justify-center">
                <span class="material-icons text-green-600 text-sm">schedule</span>
              </div>
              <h2 class="text-xl font-bold text-gray-900">Backup Schedule</h2>
            </div>

            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Automated Backups -->
                <div class="space-y-4">
                  <h3 class="text-lg font-semibold text-gray-900">Automated Backups</h3>
                  <div class="space-y-3">
                    <label class="flex items-center justify-between p-4 bg-gray-50 rounded-classroom cursor-pointer">
                      <div class="flex items-center space-x-3">
                        <input type="checkbox" v-model="schedule.daily" class="w-4 h-4 text-blue-600 rounded">
                        <div>
                          <div class="font-medium text-gray-900">Daily Backups</div>
                          <div class="text-sm text-gray-500">Every day at 2:00 AM</div>
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="text-sm font-medium text-gray-900">Enabled</div>
                      </div>
                    </label>

                    <label class="flex items-center justify-between p-4 bg-gray-50 rounded-classroom cursor-pointer">
                      <div class="flex items-center space-x-3">
                        <input type="checkbox" v-model="schedule.weekly" class="w-4 h-4 text-blue-600 rounded">
                        <div>
                          <div class="font-medium text-gray-900">Weekly Full Backup</div>
                          <div class="text-sm text-gray-500">Every Sunday at 3:00 AM</div>
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="text-sm font-medium text-gray-900">Enabled</div>
                      </div>
                    </label>

                    <label class="flex items-center justify-between p-4 bg-gray-50 rounded-classroom cursor-pointer">
                      <div class="flex items-center space-x-3">
                        <input type="checkbox" v-model="schedule.monthly" class="w-4 h-4 text-blue-600 rounded">
                        <div>
                          <div class="font-medium text-gray-900">Monthly Archive</div>
                          <div class="text-sm text-gray-500">First day of month at 4:00 AM</div>
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="text-sm font-medium text-gray-900">Enabled</div>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Retention Policy -->
                <div class="space-y-4">
                  <h3 class="text-lg font-semibold text-gray-900">Retention Policy</h3>
                  <div class="space-y-3">
                    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-classroom">
                      <div>
                        <div class="font-medium text-gray-900">Daily Backups</div>
                        <div class="text-sm text-gray-500">Keep for 30 days</div>
                      </div>
                      <select class="bg-white border border-gray-300 rounded-classroom px-3 py-1 text-sm">
                        <option>30 days</option>
                        <option>14 days</option>
                        <option>7 days</option>
                      </select>
                    </div>

                    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-classroom">
                      <div>
                        <div class="font-medium text-gray-900">Weekly Backups</div>
                        <div class="text-sm text-gray-500">Keep for 12 weeks</div>
                      </div>
                      <select class="bg-white border border-gray-300 rounded-classroom px-3 py-1 text-sm">
                        <option>12 weeks</option>
                        <option>8 weeks</option>
                        <option>4 weeks</option>
                      </select>
                    </div>

                    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-classroom">
                      <div>
                        <div class="font-medium text-gray-900">Monthly Archives</div>
                        <div class="text-sm text-gray-500">Keep for 12 months</div>
                      </div>
                      <select class="bg-white border border-gray-300 rounded-classroom px-3 py-1 text-sm">
                        <option>12 months</option>
                        <option>6 months</option>
                        <option>3 months</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                <button 
                  @click="resetSchedule"
                  class="px-4 py-2 border border-gray-300 text-gray-700 rounded-classroom hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
                <button 
                  @click="saveSchedule"
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-classroom transition-colors flex items-center space-x-2"
                >
                  <span class="material-icons text-sm">save</span>
                  <span>Save Schedule</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Recovery & Status -->
        <div class="space-y-6">
          <!-- Recovery Options -->
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-8 h-8 bg-red-100 rounded-classroom flex items-center justify-center">
                <span class="material-icons text-red-600 text-sm">restore</span>
              </div>
              <h2 class="text-xl font-bold text-gray-900">Recovery Options</h2>
            </div>

            <div class="space-y-4">
              <button 
                @click="openRestoreModal"
                class="w-full flex items-center justify-between p-4 bg-red-50 rounded-classroom hover:bg-red-100 transition-colors"
              >
                <div class="flex items-center space-x-3">
                  <span class="material-icons text-red-600 text-lg">restore_page</span>
                  <div class="text-left">
                    <div class="font-medium text-gray-900">Restore from Backup</div>
                    <div class="text-sm text-gray-600">Select a backup to restore</div>
                  </div>
                </div>
                <span class="material-icons text-gray-400 text-lg">chevron_right</span>
              </button>

              <button 
                @click="openExportModal"
                class="w-full flex items-center justify-between p-4 bg-blue-50 rounded-classroom hover:bg-blue-100 transition-colors"
              >
                <div class="flex items-center space-x-3">
                  <span class="material-icons text-blue-600 text-lg">download</span>
                  <div class="text-left">
                    <div class="font-medium text-gray-900">Export Backup</div>
                    <div class="text-sm text-gray-600">Download backup file</div>
                  </div>
                </div>
                <span class="material-icons text-gray-400 text-lg">chevron_right</span>
              </button>

              <button 
                @click="openVerifyModal"
                class="w-full flex items-center justify-between p-4 bg-green-50 rounded-classroom hover:bg-green-100 transition-colors"
              >
                <div class="flex items-center space-x-3">
                  <span class="material-icons text-green-600 text-lg">verified</span>
                  <div class="text-left">
                    <div class="font-medium text-gray-900">Verify Backup</div>
                    <div class="text-sm text-gray-600">Check backup integrity</div>
                  </div>
                </div>
                <span class="material-icons text-gray-400 text-lg">chevron_right</span>
              </button>
            </div>
          </div>

          <!-- System Status -->
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Backup Status</h2>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Last Full Backup</span>
                <span class="text-sm font-medium text-gray-900">12 hours ago</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Storage Used</span>
                <span class="text-sm font-medium text-gray-900">45%</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Backup Health</span>
                <span class="text-sm font-medium text-green-600">Good</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Auto Backup</span>
                <span class="text-sm font-medium text-green-600">Enabled</span>
              </div>
            </div>
          </div>

          <!-- Recent Backups -->
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-gray-900">Recent Backups</h2>
              <button 
                @click="refreshBackups"
                class="text-sm text-blue-600 hover:text-blue-800"
              >
                Refresh
              </button>
            </div>

            <div class="space-y-4">
              <div 
                v-for="backup in recentBackups"
                :key="backup.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-classroom"
              >
                <div class="flex items-center space-x-3">
                  <div 
                    class="w-8 h-8 rounded-classroom flex items-center justify-center"
                    :class="getBackupColor(backup.type)"
                  >
                    <span class="material-icons text-sm text-white">{{ getBackupIcon(backup.type) }}</span>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ backup.name }}</div>
                    <div class="text-xs text-gray-500">{{ backup.time }}</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-xs font-medium" :class="getStatusClass(backup.status)">
                    {{ backup.status }}
                  </div>
                  <div class="text-xs text-gray-500">{{ backup.size }}</div>
                </div>
              </div>

              <div v-if="recentBackups.length === 0" class="text-center py-4 text-gray-500">
                <span class="material-icons text-4xl opacity-50 mb-2">inbox</span>
                <p>No recent backups</p>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div class="grid grid-cols-2 gap-3">
              <button 
                @click="testBackup"
                class="p-3 bg-blue-50 rounded-classroom hover:bg-blue-100 transition-colors text-center"
              >
                <span class="material-icons text-blue-600 text-lg mb-1">play_arrow</span>
                <div class="text-xs font-medium">Test Backup</div>
              </button>
              <button 
                @click="cleanupOld"
                class="p-3 bg-orange-50 rounded-classroom hover:bg-orange-100 transition-colors text-center"
              >
                <span class="material-icons text-orange-600 text-lg mb-1">cleaning_services</span>
                <div class="text-xs font-medium">Cleanup Old</div>
              </button>
              <button 
                @click="viewLogs"
                class="p-3 bg-purple-50 rounded-classroom hover:bg-purple-100 transition-colors text-center"
              >
                <span class="material-icons text-purple-600 text-lg mb-1">list_alt</span>
                <div class="text-xs font-medium">View Logs</div>
              </button>
              <button 
                @click="emergencyBackup"
                class="p-3 bg-red-50 rounded-classroom hover:bg-red-100 transition-colors text-center"
              >
                <span class="material-icons text-red-600 text-lg mb-1">warning</span>
                <div class="text-xs font-medium">Emergency</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Restore Modal -->
    <div v-if="showRestoreModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Restore from Backup</h2>
          <button @click="showRestoreModal = false" class="text-gray-400 hover:text-gray-600">
            <span class="material-icons">close</span>
          </button>
        </div>

        <div class="space-y-4">
          <div class="bg-red-50 border border-red-200 rounded-classroom p-4 mb-4">
            <div class="flex items-start space-x-3">
              <span class="material-icons text-red-600">warning</span>
              <div>
                <h3 class="font-medium text-red-900 mb-1">Warning</h3>
                <p class="text-sm text-red-800">Restoring will overwrite all current data with the selected backup.</p>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <h3 class="font-semibold text-gray-900">Select a backup to restore:</h3>
            <div 
              v-for="backup in recentBackups.filter(b => b.status === 'Completed')"
              :key="backup.id"
              @click="restoreBackup(backup)"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-classroom hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <div class="flex items-center space-x-3">
                <div :class="getBackupColor(backup.type)" class="w-10 h-10 rounded-classroom flex items-center justify-center">
                  <span class="material-icons text-white">{{ getBackupIcon(backup.type) }}</span>
                </div>
                <div>
                  <div class="font-medium text-gray-900">{{ backup.name }}</div>
                  <div class="text-sm text-gray-500">{{ backup.time }} • {{ backup.size }}</div>
                </div>
              </div>
              <span class="material-icons text-gray-400">chevron_right</span>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button
              @click="showRestoreModal = false"
              class="px-6 py-2 border border-gray-300 rounded-classroom hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Export Modal -->
    <div v-if="showExportModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Export Backup</h2>
          <button @click="showExportModal = false" class="text-gray-400 hover:text-gray-600">
            <span class="material-icons">close</span>
          </button>
        </div>

        <div class="space-y-4">
          <div class="bg-blue-50 border border-blue-200 rounded-classroom p-4 mb-4">
            <div class="flex items-start space-x-3">
              <span class="material-icons text-blue-600">info</span>
              <div>
                <h3 class="font-medium text-blue-900 mb-1">Export Information</h3>
                <p class="text-sm text-blue-800">Download backup files to your local machine for safekeeping.</p>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <h3 class="font-semibold text-gray-900">Select backup to download:</h3>
            <div 
              v-for="backup in recentBackups"
              :key="backup.id"
              @click="exportBackup(backup)"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-classroom hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <div class="flex items-center space-x-3">
                <div :class="getBackupColor(backup.type)" class="w-10 h-10 rounded-classroom flex items-center justify-center">
                  <span class="material-icons text-white">{{ getBackupIcon(backup.type) }}</span>
                </div>
                <div>
                  <div class="font-medium text-gray-900">{{ backup.name }}</div>
                  <div class="text-sm text-gray-500">{{ backup.time }} • {{ backup.size }}</div>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-xs font-medium px-2 py-1 rounded-full" :class="backup.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                  {{ backup.status }}
                </span>
                <span class="material-icons text-blue-600">download</span>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button
              @click="showExportModal = false"
              class="px-6 py-2 border border-gray-300 rounded-classroom hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Verify Modal -->
    <div v-if="showVerifyModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Verify Backup Integrity</h2>
          <button @click="showVerifyModal = false" class="text-gray-400 hover:text-gray-600">
            <span class="material-icons">close</span>
          </button>
        </div>

        <div class="space-y-4">
          <div class="bg-green-50 border border-green-200 rounded-classroom p-4 mb-4">
            <div class="flex items-start space-x-3">
              <span class="material-icons text-green-600">verified</span>
              <div>
                <h3 class="font-medium text-green-900 mb-1">Verification Process</h3>
                <p class="text-sm text-green-800">Check backup files for corruption and verify data integrity.</p>
              </div>
            </div>
          </div>

          <div v-if="verifying && selectedBackup" class="space-y-3 p-4 bg-gray-50 rounded-classroom">
            <div class="flex items-center justify-between">
              <span class="font-medium text-gray-900">Verifying: {{ selectedBackup.name }}</span>
              <span class="text-sm font-medium text-blue-600">{{ verifyProgress }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: verifyProgress + '%' }"
              ></div>
            </div>
          </div>

          <div v-if="!verifying" class="space-y-3">
            <h3 class="font-semibold text-gray-900">Select backup to verify:</h3>
            <div 
              v-for="backup in recentBackups"
              :key="backup.id"
              @click="verifyBackup(backup)"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-classroom hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <div class="flex items-center space-x-3">
                <div :class="getBackupColor(backup.type)" class="w-10 h-10 rounded-classroom flex items-center justify-center">
                  <span class="material-icons text-white">{{ getBackupIcon(backup.type) }}</span>
                </div>
                <div>
                  <div class="font-medium text-gray-900">{{ backup.name }}</div>
                  <div class="text-sm text-gray-500">{{ backup.time }} • {{ backup.size }}</div>
                </div>
              </div>
              <span class="material-icons text-green-600">verified</span>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button
              @click="showVerifyModal = false"
              :disabled="verifying"
              class="px-6 py-2 border border-gray-300 rounded-classroom hover:bg-gray-50 disabled:bg-gray-100"
            >
              {{ verifying ? 'Verifying...' : 'Close' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const backupInProgress = ref(false)
const schedule = ref({
  daily: true,
  weekly: true,
  monthly: false
})

// Modal states
const showRestoreModal = ref(false)
const showExportModal = ref(false)
const showVerifyModal = ref(false)
const selectedBackup = ref(null)
const verifying = ref(false)
const verifyProgress = ref(0)

const recentBackups = ref([
  {
    id: 1,
    name: 'Full System Backup',
    type: 'full',
    status: 'Completed',
    time: '12 hours ago',
    size: '2.4 GB'
  },
  {
    id: 2,
    name: 'Database Backup',
    type: 'database',
    status: 'Completed',
    time: '1 day ago',
    size: '1.2 GB'
  },
  {
    id: 3,
    name: 'Media Files',
    type: 'media',
    status: 'Failed',
    time: '2 days ago',
    size: '980 MB'
  }
])

// Backup operations
const startFullBackup = async () => {
  backupInProgress.value = true
  showToast('Starting full system backup...')
  
  // Simulate backup process
  setTimeout(() => {
    backupInProgress.value = false
    showToast('Full system backup completed successfully!')
    addRecentBackup('Full System Backup', 'full', 'Completed', '2.4 GB')
  }, 3000)
}

const startDatabaseBackup = async () => {
  backupInProgress.value = true
  showToast('Starting database backup...')
  
  setTimeout(() => {
    backupInProgress.value = false
    showToast('Database backup completed successfully!')
    addRecentBackup('Database Backup', 'database', 'Completed', '1.2 GB')
  }, 2000)
}

const startConfigBackup = async () => {
  backupInProgress.value = true
  showToast('Starting configuration backup...')
  
  setTimeout(() => {
    backupInProgress.value = false
    showToast('Configuration backup completed successfully!')
    addRecentBackup('Configuration Backup', 'config', 'Completed', '45 MB')
  }, 1000)
}

const startMediaBackup = async () => {
  backupInProgress.value = true
  showToast('Starting media files backup...')
  
  setTimeout(() => {
    backupInProgress.value = false
    showToast('Media files backup completed successfully!')
    addRecentBackup('Media Files Backup', 'media', 'Completed', '980 MB')
  }, 2500)
}

// Recovery operations
const openRestoreModal = () => {
  showRestoreModal.value = true
}

const openExportModal = () => {
  showExportModal.value = true
}

const openVerifyModal = () => {
  showVerifyModal.value = true
}

const restoreBackup = (backup) => {
  if (confirm(`Are you sure you want to restore from "${backup.name}"? This will overwrite current data.`)) {
    showToast('Restoring backup... This may take a few minutes.')
    // Simulate restore process
    setTimeout(() => {
      showRestoreModal.value = false
      showToast('Backup restored successfully!')
    }, 3000)
  }
}

const exportBackup = (backup) => {
  showToast(`Downloading ${backup.name}...`)
  // Create a simulated download
  const blob = new Blob([`Backup Export: ${backup.name}\nSize: ${backup.size}\nDate: ${backup.time}`], { type: 'text/plain' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${backup.name.replace(/\s+/g, '_')}_${Date.now()}.bak`
  a.click()
  window.URL.revokeObjectURL(url)
  showToast(`${backup.name} downloaded successfully!`)
}

const verifyBackup = (backup) => {
  selectedBackup.value = backup
  verifying.value = true
  verifyProgress.value = 0
  
  // Simulate verification process
  const interval = setInterval(() => {
    verifyProgress.value += 10
    if (verifyProgress.value >= 100) {
      clearInterval(interval)
      verifying.value = false
      showToast(`${backup.name} verified successfully! Backup is valid.`)
    }
  }, 300)
}

// Schedule management
const saveSchedule = () => {
  showToast('Backup schedule saved successfully!')
}

const resetSchedule = () => {
  schedule.value = {
    daily: true,
    weekly: true,
    monthly: false
  }
  showToast('Schedule reset to defaults')
}

// Quick actions
const testBackup = () => {
  showToast('Testing backup process...')
}

const cleanupOld = () => {
  showToast('Cleaning up old backups...')
}

const viewLogs = () => {
  router.push({ name: 'AdminLogs' })
}

const emergencyBackup = () => {
  showToast('Starting emergency backup procedure...')
}

const refreshBackups = () => {
  showToast('Refreshing backup list...')
}

// Helper functions
const getBackupColor = (type) => {
  const colors = {
    full: 'bg-blue-500',
    database: 'bg-green-500',
    config: 'bg-purple-500',
    media: 'bg-orange-500'
  }
  return colors[type] || 'bg-gray-500'
}

const getBackupIcon = (type) => {
  const icons = {
    full: 'cloud_upload',
    database: 'storage',
    config: 'settings',
    media: 'folder'
  }
  return icons[type] || 'help'
}

const getStatusClass = (status) => {
  const classes = {
    Completed: 'text-green-600',
    Processing: 'text-blue-600',
    Failed: 'text-red-600',
    Pending: 'text-yellow-600'
  }
  return classes[status] || 'text-gray-600'
}

const addRecentBackup = (name, type, status, size) => {
  recentBackups.value.unshift({
    id: Date.now(),
    name,
    type,
    status,
    time: 'Just now',
    size
  })
}

const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  } else {
    alert(message)
  }
}

onMounted(() => {
  // Initialize backup data
  console.log('Backup module initialized')
})
</script>

<style scoped>
/* Custom styles for enhanced visual appeal */
</style>
