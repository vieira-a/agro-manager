import { DashBoardResponse } from 'src/producer/web/rest/dto/response/dashboard.response';
import { Farm, Producer } from '../../domain/model';

export class ProducerSummary {
  private totalFarms = 0;
  private totalHectares = 0;
  private agricultural = 0;
  private vegetation = 0;
  private totalState: Record<string, number> = {};
  private totalCrop: Record<string, number> = {};

  addFarm(farm: Farm) {
    this.totalFarms++;
    (this.totalHectares += farm.getTotalArea()),
      (this.agricultural += farm.getAgriculturalArea()),
      (this.vegetation += farm.getVegetationArea());

    const state = farm.getState();
    this.totalState[state] = (this.totalState[state] || 0) + 1;

    for (const harvest of farm.getHarvests()) {
      const crop = harvest.getCrop().getName();
      this.totalCrop[crop] = (this.totalCrop[crop] || 0) + 1;
    }
  }

  static buid(producers: Producer[]): ProducerSummary {
    const summary = new ProducerSummary();

    for (const producer of producers) {
      for (const farm of producer.getFarms()) {
        summary.addFarm(farm);
      }
    }

    return summary;
  }

  toJSON(): DashBoardResponse {
    return {
      totalFarms: this.totalFarms,
      totalHectares: this.totalHectares,
      totalState: this.totalState,
      totalCrop: this.totalCrop,
      landUsage: {
        agricultural: this.agricultural,
        vegetation: this.vegetation,
      },
    };
  }
}
