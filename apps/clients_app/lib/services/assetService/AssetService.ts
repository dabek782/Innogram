import api from "../authenticateService/authFetch";

type UploadAssetResponse = {
  id: string;
  filePath: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  orderIndex: number;
  createdAt: string;
  createdById: string;
  updatedAt: string;
  updatedById: string | null;
};

class AssetService {
  async upload(file: File): Promise<UploadAssetResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post<UploadAssetResponse>(
      "/api/v3/asset/create",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return res.data;
  }
}

export const assetService = new AssetService();
