package com.bms.restaurant_system.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    
    private Upload upload = new Upload();
    
    public Upload getUpload() {
        return upload;
    }

    public void setUpload(Upload upload) {
        this.upload = upload;
    }
    
    public static class Upload {
        private String dir;
        
        public String getDir() {
            return dir;
        }
        
        public void setDir(String dir) {
            this.dir = dir;
        }
    }
}