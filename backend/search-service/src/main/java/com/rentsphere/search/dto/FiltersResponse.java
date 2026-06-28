package com.rentsphere.search.dto;

import java.util.List;

public class FiltersResponse {
    private List<String> cities;
    private List<String> propertyTypes;
    private PriceRange priceRange;

    public FiltersResponse(List<String> cities, List<String> propertyTypes, PriceRange priceRange) {
        this.cities = cities; this.propertyTypes = propertyTypes; this.priceRange = priceRange;
    }

    public List<String> getCities() { return cities; }
    public void setCities(List<String> cities) { this.cities = cities; }
    public List<String> getPropertyTypes() { return propertyTypes; }
    public void setPropertyTypes(List<String> propertyTypes) { this.propertyTypes = propertyTypes; }
    public PriceRange getPriceRange() { return priceRange; }
    public void setPriceRange(PriceRange priceRange) { this.priceRange = priceRange; }

    public static class PriceRange {
        private Double min;
        private Double max;
        public PriceRange(Double min, Double max) { this.min = min; this.max = max; }
        public Double getMin() { return min; }
        public void setMin(Double min) { this.min = min; }
        public Double getMax() { return max; }
        public void setMax(Double max) { this.max = max; }
    }
}
