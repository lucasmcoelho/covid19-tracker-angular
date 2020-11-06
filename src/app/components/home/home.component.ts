import { Component, OnInit } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  totalConfirmed = 0;
  totalActive = 0;
  totalDeath = 0;
  totalRecovered = 0;
  globalData : GlobalDataSummary[];
  pieChart : GoogleChartInterface = {
    chartType: 'PieChart'
  }
  ColumnChart : GoogleChartInterface = {
    chartType: 'ColumnChart'
  }
  constructor( private dataService : DataServiceService) { }

  initChart(caseType : string){

    let datatable = [];
    datatable.push(["Country" , "Cases"])
    this.globalData.forEach(cs=>{
      let value : number;
      if (caseType == 'c')
        if(cs.confirmed > 1000000)
          value = cs.confirmed;
      if (caseType == 'a')
        if(cs.active > 2000)
          value = cs.active;
      if (caseType == 'd')
        if(cs.deaths > 2000)
          value = cs.deaths;
      if (caseType == 'r')
        if(cs.recovered > 20000)
          value = cs.recovered;


      datatable.push([
        cs.country, value
      ])
    })

    this.pieChart = {
      chartType: 'PieChart',
      dataTable: datatable,
      //firstRowIsData: true,
      options: {
        height: 500
      }
    };
    this.ColumnChart = {
      chartType: 'ColumnChart',
      dataTable: datatable,
      //firstRowIsData: true,
      options: {
        height: 500
      }
    };
  }

  ngOnInit(): void {

    this.dataService.getGlobalData()
    .subscribe(
      {
        next: (result)=>{
          //console.log(result);
          this.globalData = result;
          result.forEach(cs=>{
            if(!Number.isNaN(cs.confirmed)){
              this.totalActive += cs.active;
              this.totalConfirmed += cs.confirmed;
              this.totalDeath += cs.deaths;
              this.totalRecovered += cs.recovered;
            }
          })
          this.initChart('c');
        }
      }
    )

  }

  updateChart(input : HTMLInputElement){
    this.initChart(input.value)
  }

}
