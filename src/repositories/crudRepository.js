export default function crudRepository() {
  return {
    create: async function (data) {
      const newDoc = await this.create(data);
      return newDoc;
    },
    getAll: async function () {
      const allDocs = await this.find();
      return allDocs;
    },
    getById: async function (id) {
      const doc = await this.findById(id);
      return doc;
    },
    delete: async function (id) {
      const response = await this.findByIdAndDelete(id);
      return response;
    },
    update: async function (id, data) {
      const updateDoc = await this.findByIdAndUpdate(id, data, {
        new: true
      });
      return updateDoc;
    }
  };
}
